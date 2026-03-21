import { getImage, imageMap } from './getImage';

describe('utils/getImage', () => {
  it('should return the correct asset for a valid key', () => {
    expect(getImage('result')).toBe(imageMap.result);
  });

  it('should return the correct asset for anxietyRelease', () => {
    expect(getImage('anxietyRelease')).toBe(imageMap.anxietyRelease);
  });
});
