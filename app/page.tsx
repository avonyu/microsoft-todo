import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Star, SquareKanban, Home as HomeIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ScrollButton } from "@/components/scroll-button";

const features = [
  {
    title: "我的一天",
    icon: Sun,
    color: "text-amber-500",
    description: "专注于你的一天，每日刷新的任务列表",
  },
  {
    title: "重要",
    icon: Star,
    color: "text-yellow-500",
    description: "为任务加星标，跟踪优先事项",
  },
  {
    title: "计划内",
    icon: SquareKanban,
    color: "text-blue-500",
    description: "带有截止日期和提醒的任务",
  },
  {
    title: "任务",
    icon: HomeIcon,
    color: "text-cyan-500",
    description: "查看和管理所有任务",
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const getStartedHref = session ? "/todo" : "/register";
  return (
    <>
      <Header />
      <main
        className={cn(
          "bg-linear-to-br from-gray-50 to-gray-100",
          "dark:from-gray-900 dark:to-gray-800"
        )}
      >
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center min-h-screen px-4">
          <h1
            className={cn(
              "font-bold text-5xl md:text-6xl lg:text-8xl",
              "bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-teal-400"
            )}
          >
            Microsoft Todo
          </h1>
          <p
            className={cn(
              "mt-6 text-base md:text-xl lg:text-2xl text-gray-600 text-center max-w-2xl",
              "dark:text-gray-300"
            )}
          >
            智能任务管理，让每一天更高效
          </p>
          <div className="mt-10 flex gap-4">
            <Link href={getStartedHref}>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                开始使用
              </Button>
            </Link>
            <ScrollButton size="lg" variant="outline" targetId="features">
              了解更多
            </ScrollButton>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold text-center mb-12",
                "text-gray-900 dark:text-gray-100"
              )}
            >
              核心功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className={cn(
                      "hover:shadow-lg transition-shadow",
                      "dark:hover:shadow-gray-700"
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <Icon className={cn("w-12 h-12", feature.color)} />
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p
                          className={cn(
                            "text-gray-600",
                            "dark:text-gray-400"
                          )}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                "text-gray-900 dark:text-gray-100"
              )}
            >
              准备好开始了吗？
            </h2>
            <p
              className={cn(
                "text-lg text-gray-600 mb-8",
                "dark:text-gray-400"
              )}
            >
              免费注册，开始管理你的任务
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  免费注册
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  登录
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}