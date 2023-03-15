import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

try {
    prisma = new PrismaClient({
        log: [{ emit: "event", level: "query" }],
    });

    prisma.$on("query" as any, (event: any) => {
        console.log("\n➜ " + new Date().toLocaleString());
        console.log("Query:    " + event.query);
        console.log("Params:   " + event.params);
        console.log("Duration: " + event.duration + "ms");
    });
} catch (e) {
    if (typeof window === "undefined") {
        throw e;
    }
}

export { prisma };
