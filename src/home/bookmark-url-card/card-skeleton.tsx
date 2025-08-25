import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card className="@container/card h-[150px] p-6">
      <CardTitle className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 flex-none" />
        <Skeleton className="h-10 flex-1" />
      </CardTitle>
      <CardFooter className="p-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default CardSkeleton;
