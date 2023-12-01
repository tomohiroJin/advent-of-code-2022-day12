export const findElfWithMostCalories = (calorieList: string): number => {
  return Math.max(
    ...calorieList.split("\n\n").map((elfCalorieList) =>
      elfCalorieList
        .split("\n")
        .map(Number)
        .reduce((previous, current) => previous + current, 0)
    )
  );
};
