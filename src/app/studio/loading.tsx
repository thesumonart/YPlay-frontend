import { StudioDashboardSkeleton } from "@/components/shared/Skeleton";
import { StudioLayout } from "@/components/studio/StudioLayout";

export default function StudioLoading() {
  return (
    <StudioLayout>
      <StudioDashboardSkeleton />
    </StudioLayout>
  );
}
