import { getJestProjectsAsync } from "@nx/jest";

export default async (): Promise<{ projects: string[] }> => ({
    projects: await getJestProjectsAsync(),
});
