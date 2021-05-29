import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaCanvasComponent } from './arena-canvas.component';

describe('ArenaCanvasComponent', () => {
  let component: ArenaCanvasComponent;
  let fixture: ComponentFixture<ArenaCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
