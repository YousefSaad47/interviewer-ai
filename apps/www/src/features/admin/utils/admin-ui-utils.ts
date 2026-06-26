const successStatuses = ["Active", "Accepted", "Completed", "Reviewed"];
const warningStatuses = [
  "Trial",
  "Processing",
  "Partial",
  "Pending",
  "Invited",
  "Needs edits",
];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export const getStatusTone = (status: string) => {
  if (successStatuses.includes(status)) {
    return "success";
  }

  if (warningStatuses.includes(status)) {
    return "warning";
  }

  return "destructive";
};

export const getDifficultyTone = (difficulty: string) => {
  if (difficulty === "Easy") {
    return "success";
  }

  if (difficulty === "Medium") {
    return "warning";
  }

  return "destructive";
};
