import { Prisma } from "@prisma/client";

const SELECT_ACTIVITY = (taskId: number) => Prisma.sql`
    SELECT "change" as type, id, created_at
        FROM TaskChange
            WHERE task_id = ${taskId}
    UNION
    SELECT "comment" as type, id, created_at
        FROM TaskComment
            WHERE task_id = ${taskId}
    ORDER BY
        created_at ASC
`;

export { SELECT_ACTIVITY };
