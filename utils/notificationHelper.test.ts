import { 
    formatBackendTime, 
    repeatLabelFromDays, 
    inferRepeatFromWeekdays,
    daysShortToNums,
    numsToDaysShort
} from './notificationHelper';

describe('utils/notificationHelper', () => {
  describe('formatBackendTime', () => {
    it('converts HH:mm:ss to 12h format', () => {
      expect(formatBackendTime('13:30:00')).toBe('1:30 PM');
      expect(formatBackendTime('08:05:00')).toBe('8:05 AM');
    });

    it('handles HH:mm format by normalizing', () => {
      expect(formatBackendTime('22:00')).toBe('10:00 PM');
    });

    it('returns fallback for invalid input', () => {
      expect(formatBackendTime('invalid', 'N/A')).toBe('N/A');
      expect(formatBackendTime(null, 'None')).toBe('None');
    });
  });

  describe('repeatLabelFromDays', () => {
    it('identifies Everyday', () => {
      const entry = { days_of_week: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] };
      expect(repeatLabelFromDays(entry as any)).toBe('Every day');
    });

    it('identifies Weekdays', () => {
      const entry = { days_of_week: ['mon', 'tue', 'wed', 'thu', 'fri'] };
      expect(repeatLabelFromDays(entry as any)).toBe('Weekdays');
    });

    it('identifies Weekends', () => {
      const entry = { days_of_week: ['sat', 'sun'] };
      expect(repeatLabelFromDays(entry as any)).toBe('Weekends');
    });

    it('returns Custom for other combinations', () => {
      const entry = { days_of_week: ['mon', 'wed'] };
      expect(repeatLabelFromDays(entry as any)).toBe('Custom');
    });
  });

  describe('inferRepeatFromWeekdays', () => {
    it('should return daily for all days', () => {
        expect(inferRepeatFromWeekdays([0, 1, 2, 3, 4, 5, 6])).toBe('daily');
    });
    it('should return weekdays for 1-5', () => {
        expect(inferRepeatFromWeekdays([1, 2, 3, 4, 5])).toBe('weekdays');
    });
    it('should return weekends for 0 and 6', () => {
        expect(inferRepeatFromWeekdays([0, 6])).toBe('weekends');
    });
  });

  describe('Mapping Helpers', () => {
    it('daysShortToNums maps correctly', () => {
      expect(daysShortToNums(['sun', 'mon', 'sat'])).toEqual([0, 1, 6]);
    });

    it('numsToDaysShort maps correctly', () => {
      expect(numsToDaysShort([0, 1, 6])).toEqual(['sun', 'mon', 'sat']);
    });
  });
});
