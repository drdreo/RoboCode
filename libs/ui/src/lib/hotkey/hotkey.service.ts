import { inject, Injectable } from "@angular/core";
import { EventManager } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import {
    debounceTime,
    EMPTY,
    filter,
    fromEvent,
    map,
    merge,
    mergeMap,
    Observable,
    of,
    startWith,
    Subject,
    Subscription,
    tap,
} from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { hostPlatform, normalizeKeys } from "./platform";

// ref: https://github.com/ngneat/hotkeys/blob/master/projects/ngneat/hotkeys/src/lib/hotkeys.service.ts

export type AllowInElement = "INPUT" | "TEXTAREA" | "SELECT" | "CONTENTEDITABLE";
export type Options = {
    group: string;
    element: HTMLElement;
    trigger: "keydown" | "keyup";
    allowIn: AllowInElement[];
    description: string;
    showInHelpMenu: boolean;
    preventDefault: boolean;
};

export interface HotkeyGroup {
    group: string;
    hotkeys: { keys: string; description: string }[];
}

export type Hotkey = Partial<Options> & { keys: string };
export type HotkeyCallback = (event: KeyboardEvent | Hotkey, keys: string, target: HTMLElement) => void;

interface HotkeySummary {
    hotkey: Hotkey;
    subject: Subject<Hotkey>;
}

interface SequenceSummary {
    subscription: Subscription;
    observer: Observable<Hotkey>;
    hotkeyMap: Map<string, HotkeySummary>;
}

@Injectable({ providedIn: "root" })
export class HotkeyService {
    private readonly hotkeys = new Map<string, Hotkey>();
    private readonly dispose = new Subject<string>();
    private readonly defaults: Options = {
        trigger: "keydown",
        allowIn: [],
        element: inject(DOCUMENT).documentElement,
        group: "",
        description: "",
        showInHelpMenu: true,
        preventDefault: true,
    };
    private callbacks: HotkeyCallback[] = [];
    private sequenceMaps = new Map<HTMLElement, SequenceSummary>();
    private sequenceDebounce = 250;

    private activeKeys: Set<string> = new Set();

    private readonly eventManager = inject(EventManager);
    private readonly document = inject(DOCUMENT);

    constructor() {
        // this.addShortcut({ keys: "shift" }).subscribe(console.log);
        // this.eventManager.addEventListener(this.document.documentElement, "keydown", (evt: KeyboardEvent) => {
        //     const keys = getEventKeys(evt);
        //     keys.forEach((key) => this.activeKeys.add(key));
        //     console.log(this.activeKeys);
        //     this.activeHotkey = Array.from(this.activeKeys).sort().join("+");
        // });
        //
        // this.eventManager.addEventListener(this.document.documentElement, "keyup", (evt: KeyboardEvent) => {
        //     const keys = getEventKeys(evt);
        //     console.log("keyup", keys);
        //     keys.forEach((key) => this.activeKeys.delete(key));
        //     this.activeHotkey = Array.from(this.activeKeys).sort().join("+");
        // });
    }

    // getHotkeys(): Hotkey[] {
    //     const sequenceKeys = Array.from(this.sequenceMaps.values())
    //         .map((s) => [s.hotkeyMap].reduce((_acc, val) => [...val.values()], []))
    //         .reduce((_x, y) => y, [])
    //         .map((h) => h.hotkey);
    //
    //     return Array.from(this.hotkeys.values()).concat(sequenceKeys);
    // }
    //
    // getShortcuts(): HotkeyGroup[] {
    //     const hotkeys = this.getHotkeys();
    //     const groups: HotkeyGroup[] = [];
    //
    //     for (const hotkey of hotkeys) {
    //         if (!hotkey.showInHelpMenu) {
    //             continue;
    //         }
    //
    //         let group = groups.find((g) => g.group === hotkey.group);
    //         if (!group) {
    //             group = { group: hotkey.group, hotkeys: [] };
    //             groups.push(group);
    //         }
    //
    //         const normalizedKeys = normalizeKeys(hotkey.keys, hostPlatform());
    //         group.hotkeys.push({ keys: normalizedKeys, description: hotkey.description });
    //     }
    //
    //     return groups;
    // }

    addSequenceShortcut(options: Hotkey): Observable<Hotkey> {
        const getSequenceObserver = (element: HTMLElement, eventName: string) => {
            let sequence = "";
            return fromEvent<KeyboardEvent>(element, eventName).pipe(
                tap(
                    (e) =>
                        (sequence = `${sequence}${sequence ? ">" : ""}${e.ctrlKey ? "control." : ""}${e.altKey ? "alt." : ""}${
                            e.shiftKey ? "shift." : ""
                        }${e.key}`),
                ),
                debounceTime(this.sequenceDebounce),
                mergeMap(() => {
                    const resultSequence = sequence;
                    sequence = "";
                    const summary = this.sequenceMaps.get(element);
                    if (summary?.hotkeyMap.has(resultSequence)) {
                        const hotkeySummary = summary.hotkeyMap.get(resultSequence);
                        if (!hotkeySummary) {
                            throw new Error(`Hotkey sequence not found: '${resultSequence}'`);
                        }
                        hotkeySummary.subject.next(hotkeySummary.hotkey);
                        return of(hotkeySummary.hotkey);
                    } else {
                        return EMPTY;
                    }
                }),
            );
        };

        const mergedOptions = { ...this.defaults, ...options };
        const normalizedKeys = normalizeKeys(mergedOptions.keys, hostPlatform());

        const getSequenceCompleteObserver = (): Observable<Hotkey> => {
            const hotkeySummary = {
                subject: new Subject<Hotkey>(),
                hotkey: mergedOptions,
            };

            if (this.sequenceMaps.has(mergedOptions.element)) {
                const sequenceSummary = this.sequenceMaps.get(mergedOptions.element);
                if (!sequenceSummary) {
                    throw new Error(`Sequence summary not found: ${normalizedKeys}`);
                }
                if (sequenceSummary?.hotkeyMap.has(normalizedKeys)) {
                    throw new Error(`Duplicate hotkey sequence: ${normalizedKeys}`);
                }

                sequenceSummary.hotkeyMap.set(normalizedKeys, hotkeySummary);
            } else {
                const observer = getSequenceObserver(mergedOptions.element, mergedOptions.trigger);
                const subscription = observer.subscribe();

                const hotkeyMap = new Map<string, HotkeySummary>([[normalizedKeys, hotkeySummary]]);
                const sequenceSummary = { subscription, observer, hotkeyMap };
                this.sequenceMaps.set(mergedOptions.element, sequenceSummary);
            }

            return hotkeySummary.subject.asObservable();
        };

        return getSequenceCompleteObserver().pipe(
            takeUntil<Hotkey>(this.dispose.pipe(filter((v) => v === normalizedKeys))),
            filter((hotkey) => !this.targetIsExcluded(hotkey.allowIn)),
            tap((hotkey) => this.callbacks.forEach((cb) => cb(hotkey, normalizedKeys, hotkey.element!))),
            finalize(() => this.removeShortcuts(normalizedKeys)),
        );
    }

    addShortcut(options: Hotkey): Observable<KeyboardEvent> {
        const mergedOptions = { ...this.defaults, ...options };
        const normalizedKeys = normalizeKeys(mergedOptions.keys, hostPlatform());

        if (this.hotkeys.has(normalizedKeys)) {
            throw new Error(`Duplicate hotkey: ${normalizedKeys}`);
        }

        this.hotkeys.set(normalizedKeys, mergedOptions);
        const event = `${mergedOptions.trigger}.${normalizedKeys}`;

        return new Observable<KeyboardEvent>((observer) => {
            const handler = (e: KeyboardEvent) => {
                const hotkey = this.hotkeys.get(normalizedKeys);
                if (!hotkey) {
                    throw new Error(`Hotkey: '${normalizedKeys}' not found`);
                }
                const skipShortcutTrigger = this.targetIsExcluded(hotkey.allowIn);
                if (skipShortcutTrigger) {
                    return;
                }

                if (mergedOptions.preventDefault) {
                    e.preventDefault();
                }

                this.callbacks.forEach((cb) => cb(e, normalizedKeys, hotkey.element!));
                observer.next(e);
            };
            const dispose = this.eventManager.addEventListener(mergedOptions.element, event, handler);

            return () => {
                this.hotkeys.delete(normalizedKeys);
                dispose();
            };
        }).pipe(takeUntil<KeyboardEvent>(this.dispose.pipe(filter((v) => v === normalizedKeys))));
    }

    removeShortcuts(hotkeys: string | string[]): void {
        const coercedHotkeys = (Array.isArray(hotkeys) ? hotkeys : [hotkeys]).map((hotkey) =>
            normalizeKeys(hotkey, hostPlatform()),
        );
        coercedHotkeys.forEach((hotkey) => {
            this.hotkeys.delete(hotkey);
            this.dispose.next(hotkey);

            this.sequenceMaps.forEach((v, k) => {
                const summary = v.hotkeyMap.get(hotkey);
                if (summary) {
                    summary.subject.complete();
                    v.hotkeyMap.delete(hotkey);
                }
                if (v.hotkeyMap.size === 0) {
                    v.subscription.unsubscribe();
                    this.sequenceMaps.delete(k);
                }
            });
        });
    }

    setSequenceDebounce(debounce: number): void {
        this.sequenceDebounce = debounce;
    }

    onShortcut(callback: HotkeyCallback): () => void {
        this.callbacks.push(callback);

        return () => (this.callbacks = this.callbacks.filter((cb) => cb !== callback));
    }

    getActiveKeys(): Set<string> {
        return this.activeKeys;
    }

    // TODO: not tested
    addActiveShortcut(element: HTMLElement) {
        const activeKeys = new Set<string>();

        const keydown$ = fromEvent<KeyboardEvent>(element, "keydown").pipe(
            map((evt: KeyboardEvent) => {
                return this.onActiveKeyDown(evt, activeKeys);
            }),
        );

        const clear$ = keydown$.pipe(
            debounceTime(300),
            map(() => {
                activeKeys.clear();
                return activeKeys;
            }),
        );

        return merge(keydown$, clear$).pipe(startWith(activeKeys));
    }

    getEventKeys(event: KeyboardEvent): Set<string> {
        const keys = new Set<string>();
        if (event.ctrlKey) keys.add("control");
        if (event.altKey) keys.add("alt");
        if (event.shiftKey) keys.add("shift");
        keys.add(event.key.toLowerCase());
        return keys;
    }

    // addActiveShortcut({ element, preventDefault }) {
    //     const activeKeys = new Set<string>();
    //     return
    //         fromEvent<KeyboardEvent>(element, "keydown").pipe(
    //             map((evt: KeyboardEvent) => this.onActiveKeyDown(evt, activeKeys)),
    //             debounceTime(300),
    //             map(() => activeKeys.clear()),
    //         );
    // }

    private targetIsExcluded(allowIn?: AllowInElement[]) {
        const activeElement = this.document.activeElement;
        if (!activeElement) {
            return false;
        }
        const elementName = activeElement.nodeName;
        const elementIsContentEditable = (activeElement as HTMLElement).isContentEditable;
        let isExcluded = ["INPUT", "SELECT", "TEXTAREA"].includes(elementName) || elementIsContentEditable;

        if (isExcluded && allowIn?.length) {
            for (const t of allowIn) {
                if (activeElement.nodeName === t || (t === "CONTENTEDITABLE" && elementIsContentEditable)) {
                    isExcluded = false;
                    break;
                }
            }
        }

        return isExcluded;
    }

    private onActiveKeyDown(event: KeyboardEvent, activeKeys: Set<string>, preventDefault = false) {
        if (preventDefault) {
            event.preventDefault();
        }
        const keys = this.getEventKeys(event);
        keys.forEach((key) => activeKeys.add(key));
        return activeKeys;
    }
}
