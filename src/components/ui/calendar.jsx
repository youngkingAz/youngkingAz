// @ts-nocheck
import * as React from 'react';

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const weeks = [];
  let day = 1;
  let nextMonthDay = 1;

  for (let week = 0; week < 6; week += 1) {
    const row = [];

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const cellIndex = week * 7 + weekday;

      if (cellIndex < startDay) {
        row.push({
          date: new Date(year, month - 1, daysInPrevMonth - startDay + weekday + 1),
          outside: true,
        });
      } else if (day <= daysInMonth) {
        row.push({
          date: new Date(year, month, day),
          outside: false,
        });
        day += 1;
      } else {
        row.push({
          date: new Date(year, month + 1, nextMonthDay),
          outside: true,
        });
        nextMonthDay += 1;
      }
    }

    weeks.push(row);
    if (day > daysInMonth && nextMonthDay > 7) {
      break;
    }
  }

  return weeks;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const wrapperStyle = {
  padding: '0.75rem',
  width: 'fit-content',
  background: '#0b0b0b',
  border: '1px solid #262626',
  borderRadius: '0.9rem',
  color: '#f5f5f5',
};

const captionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  marginBottom: '0.75rem',
};

const navButtonStyle = {
  width: '1.9rem',
  height: '1.9rem',
  borderRadius: '0.5rem',
  border: '1px solid #3a3a3a',
  background: 'transparent',
  color: '#f5f5f5',
  cursor: 'pointer',
};

const tableStyle = {
  borderCollapse: 'collapse',
};

const headCellStyle = {
  width: '2.2rem',
  height: '2rem',
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '0.8rem',
  fontWeight: 400,
};

const cellButtonBaseStyle = {
  width: '2.2rem',
  height: '2.2rem',
  border: 'none',
  background: 'transparent',
  color: '#f5f5f5',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

function Calendar({
  className,
  showOutsideDays = true,
  selected,
  onSelect,
  defaultMonth,
  style,
  ...props
}) {
  const initialMonth = defaultMonth instanceof Date ? defaultMonth : selected instanceof Date ? selected : new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  const today = new Date();
  const weeks = getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth());
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={className} style={{ ...wrapperStyle, ...style }} {...props}>
      <div style={captionStyle}>
        <button
          type="button"
          style={navButtonStyle}
          onClick={() =>
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
          }
        >
          {'<'}
        </button>

        <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </div>

        <button
          type="button"
          style={navButtonStyle}
          onClick={() =>
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
          }
        >
          {'>'}
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day} style={headCellStyle}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={`week-${weekIndex}`}>
              {week.map(({ date, outside }) => {
                const isSelected = selected instanceof Date && isSameDay(date, selected);
                const isToday = isSameDay(date, today);

                if (outside && !showOutsideDays) {
                  return (
                    <td key={date.toISOString()}>
                      <div style={{ width: '2.2rem', height: '2.2rem' }} />
                    </td>
                  );
                }

                return (
                  <td key={date.toISOString()} style={{ textAlign: 'center', padding: '0.15rem' }}>
                    <button
                      type="button"
                      style={{
                        ...cellButtonBaseStyle,
                        color: outside ? '#6b7280' : '#f5f5f5',
                        background: isSelected ? '#f97316' : isToday ? '#1f1f1f' : 'transparent',
                        border: isToday ? '1px solid #3a3a3a' : '1px solid transparent',
                      }}
                      onClick={() => {
                        if (onSelect) {
                          onSelect(date);
                        }
                      }}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };


