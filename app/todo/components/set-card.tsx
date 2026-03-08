import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { type DefaultSet } from "../config";

export default function SetCard({ todoSet }: { todoSet: DefaultSet }) {
  return (
    <Card className="w-55 rounded-md border-0 bg-stone-600/80 backdrop-blur gap-2 py-4">
      <div className="flex justify-center my-4">
        <Image
          src={todoSet.card?.img as string}
          alt={todoSet.id}
          width={100}
          height={100}
        />
      </div>
      {todoSet.card?.title && (
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">
            {todoSet.card.title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-4">
        <p className="text-white text-xs text-center">
          {todoSet.card?.content}
        </p>
      </CardContent>
      {todoSet.id === "myday" && (
        <div className="mx-8">
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs rounded-sm h-6.5"
          >
            向“我的一天”添加任务
          </Button>
        </div>
      )}
    </Card>
  );
}
