
// @ts-ignore
import puter from '@heyputer/puter.js';
import { PUTER_WORKER_URL } from './constants';

export const signIn = async () => {
    try {
        const user = await puter.auth.signIn();
        return user;
    } catch (error) {
        console.error("Sign in failed:", error);
        return null;
    }
};

export const signOut = async () => {
    try {
        await puter.auth.signOut();
    } catch (error) {
        console.error("Sign out failed:", error);
    }
};

export const getUser = async () => {
    try {
        const user = await puter.auth.getUser();
        return user;
    } catch (error) {
        // If not signed in or error, return null
        return null;
    }
};

export const isSignedIn = async () => {
    return puter.auth.isSignedIn();
}

const isDev = import.meta.env.DEV;

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    if (isDev) console.log("Fetching project:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        if (!response.ok) {
            console.error(`Failed to fetch project (status ${response.status})`);
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        if (isDev) console.log("Fetched project:", data?.project?.id);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};

export const getUserProjects = async (): Promise<DesignItem[]> => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping projects fetch.");
        return [];
    }

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/list`,
            { method: "GET" },
        );

        if (!response.ok) {
            console.error(`Failed to fetch projects (status ${response.status})`);
            return [];
        }

        const data = (await response.json()) as {
            projects?: DesignItem[];
        };

        return data?.projects ?? [];
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
};

export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null> => {
    if (isDev) console.log("Creating/updating project:", item.id);

    try {
        const projectToSave: DesignItem = {
            ...item,
            isPublic: visibility === "public",
            timestamp: item.timestamp ?? Date.now(),
        };

        // Store project in Puter KV
        await puter.kv.set(`project:${item.id}`, JSON.stringify(projectToSave));

        // Update the project index (list of project IDs)
        const rawIndex = await puter.kv.get("project_index");
        const index: string[] = rawIndex ? JSON.parse(rawIndex as string) : [];
        if (!index.includes(item.id)) {
            index.push(item.id);
            await puter.kv.set("project_index", JSON.stringify(index));
        }

        if (isDev) console.log("Saved project:", item.id);

        return projectToSave;
    } catch (error) {
        console.error("Failed to create project:", error);
        return null;
    }
};
