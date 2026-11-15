import { GroupSafariInquiryForm } from "@/components/forms/GroupSafariInquiryForm";

export function MiniPlanningForm({ selectedTour }: { selectedTour?: string }) {
  return <GroupSafariInquiryForm selectedTour={selectedTour} />;
}
