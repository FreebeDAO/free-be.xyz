import * as Prisma from "@prisma/client";
import "vite/client";

declare global {
    interface ImportMeta {
        env: {
            BASE_URL: string;
        };
    }

    interface Window {
        ethereum: any;
    }

    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
        }
    }
}

namespace Entity {
    interface User extends Prisma.User {
        reward?: {
            amount: number;
            percent: number;
        };
    }

    interface Reward extends Prisma.TaskReward {
        dao?: Prisma.Dao;
        task?: Prisma.Task;
    }

    interface Wallet extends Prisma.Wallet {}

    interface Dao extends Prisma.Dao {}

    interface Task extends Prisma.Task {
        key_results: { checked: boolean; content: string }[];
        creator?: User;
        assignee?: User;
        changes?: Prisma.TaskChange[];
    }
}

type Nullable<T> = T | null;
