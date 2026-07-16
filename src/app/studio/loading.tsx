import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioDashboardSkeleton } from "@/components/shared/Skeleton";

export default function StudioLoading() {
  return (
    <StudioLayout>
      <StudioDashboardSkeleton />
    </StudioLayout>
  );
}
