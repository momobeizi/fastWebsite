import { Outlet, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { lazy, Suspense } from "react";

// 先定义懒加载组件（抽离出来更清晰）
const Page403 = lazy(() => import("@/pages/System/Error/Page403"));
const Page404 = lazy(() => import("@/pages/System/Error/Page404"));
const Page500 = lazy(() => import("@/pages/System/Error/Page500"));

export const ErrorRoutes: RouteObject[] = [
    {
        path: "/",
        element: (
            <MainLayout>
                <Suspense fallback={<div>页面加载中...</div>}> {/* 推荐加 fallback 加载态 */}
                    <Outlet />
                </Suspense>
            </MainLayout>
        ),
        children: [
            {
                path: "403",
                element: <Page403 />,
            },
            {
                path: "404",
                element: <Page404 />,
            },
            {
                path: "500",
                element: <Page500 />,
            }
        ]
    },
];