const APP_ROUTES = [
    //#region user
    require("../controllers/user/get-user-list"),
    require("../controllers/user/get-user"),
    require("../controllers/user/register-user"),
    require("../controllers/user/update-user"),
    //#endregion

    //#region reward
    require("../controllers/user/reward/get-user-reward-list"),
    //#endregion

    //#region wallet
    require("../controllers/user/wallet/verify-user-wallet"),
    //#endregion

    //#region dao
    require("../controllers/dao/create-dao"),
    require("../controllers/dao/get-dao-basic"),
    require("../controllers/dao/get-dao-list"),
    require("../controllers/dao/get-dao"),
    require("../controllers/dao/update-dao"),
    //#endregion

    //#region task
    require("../controllers/dao/task/create-dao-task"),
    require("../controllers/dao/task/get-dao-task-list"),
    require("../controllers/dao/task/get-dao-task"),
    require("../controllers/dao/task/update-dao-task"),
    //#endregion
];

export { APP_ROUTES };
