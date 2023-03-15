import { CreateDaoPage } from "../pages/create-dao";
import { CreateTaskPage } from "../pages/create-task";
import { DaoDetailPage } from "../pages/dao-detail";
import { DaoDiscoverPage } from "../pages/dao-discover";
import { DaoSettingsPage } from "../pages/dao-settings";
import { DaoTasksPage } from "../pages/dao-tasks";
import { TaskDetailPage } from "../pages/task-detail";
import { UserDetailPage } from "../pages/user-detail";
import { UserRegisterPage } from "../pages/user-register";
import { UserSettingsPage } from "../pages/user-settings";

const APP_ROUTES = {
    //#region 引导
    首页: {
        path: "/",
        page: DaoDiscoverPage,
    },
    //#endregion

    //#region 用户
    用户注册: {
        path: "/register",
        page: UserRegisterPage,
    },

    用户详情: {
        path: "/user/:user",
        page: UserDetailPage,
    },

    用户设置: {
        path: "/settings",
        page: UserSettingsPage,
    },
    //#endregion

    //#region 组织
    创建组织: {
        path: "/new",
        page: CreateDaoPage,
    },

    组织详情: {
        path: "/:dao",
        page: DaoDetailPage,
    },

    组织设置: {
        path: "/:dao/settings",
        page: DaoSettingsPage,
    },
    //#endregion

    //#region 任务
    任务列表: {
        path: "/:dao/tasks",
        page: DaoTasksPage,
    },

    创建任务: {
        path: "/:dao/tasks/new",
        page: CreateTaskPage,
    },

    任务详情: {
        path: "/:dao/tasks/:task",
        page: TaskDetailPage,
    },
    //#endregion
};

export { APP_ROUTES };
