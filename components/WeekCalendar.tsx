import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const generateMonthWeeks = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // First day of current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  
  // Last day of current month
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  // Start from Sunday of the week containing first day
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  
  // End at Saturday of the week containing last day
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const weeks = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentDate);
      const isCurrentMonth = d.getMonth() === currentMonth;
      
      week.push({
        day: d.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
        date: d.getDate(),
        fullDate: d,
        cal: "—",
        isToday:
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear(),
        isCurrentMonth,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  
  return weeks;
};

export default function WeekCalendar() {
  const weeks = generateMonthWeeks();
  const today = new Date();
  
  // Normalize today's date to midnight for comparison
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [selected, setSelected] = useState<Date>(todayNormalized);

  return (
    <View className="px-4 mb-6">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row space-x-3 px-2">
            {week.map((item, index) => {
              // Normalize the item date for comparison
              const itemDateNormalized = new Date(
                item.fullDate.getFullYear(),
                item.fullDate.getMonth(),
                item.fullDate.getDate()
              );
              
              const isActive = selected.getTime() === itemDateNormalized.getTime();

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const normalizedDate = new Date(
                      item.fullDate.getFullYear(),
                      item.fullDate.getMonth(),
                      item.fullDate.getDate()
                    );
                    setSelected(normalizedDate);
                  }}
                  className={`items-center py-3 px-4 rounded-2xl ${
                    isActive
                      ? "bg-white border-2 border-gray-800"
                      : "bg-transparent"
                  }`}
                  disabled={!item.isCurrentMonth}
                  style={{ opacity: item.isCurrentMonth ? 1 : 0.3 }}
                >
                  <Text
                    className={`text-xs ${
                      isActive ? "text-gray-800 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {item.day}
                  </Text>

                  <Text
                    className={`text-2xl font-bold ${
                      isActive ? "text-gray-800" : "text-gray-300"
                    }`}
                  >
                    {item.date}
                  </Text>

                  <Text
                    className={`text-xs mt-1 ${
                      isActive ? "text-orange-500 font-bold" : "text-gray-300"
                    }`}
                  >
                    {item.cal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}