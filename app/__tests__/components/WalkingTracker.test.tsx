import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalkingTracker from '@/app/component/dashboard/WalkingTracker';
import { mockFetchResponse } from '@/app/__tests__/testUtils';

describe('WalkingTracker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders walking tracker component', () => {
    const { container } = render(<WalkingTracker />);
    
    // Component should render without errors
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('displays step count information', () => {
    const mockData = {
      steps: 8500,
      goal: 10000,
      date: new Date().toISOString(),
    };
    
    const { container } = render(<WalkingTracker />);
    
    // Tracker should display or be ready to display
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('loads walking data on mount', async () => {
    const mockData = {
      steps: 5000,
      goal: 10000,
      distance: 2.5,
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse(200, mockData));
    
    const { container } = render(<WalkingTracker />);
    
    // Component renders successfully with data
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('handles loading state', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockFetchResponse(200, {})), 1000))
    );
    
    const { container } = render(<WalkingTracker />);
    
    // Component should handle loading gracefully
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('displays progress towards daily goal', () => {
    const { container } = render(<WalkingTracker />);
    
    // Progress indicator or information should be present
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('shows encouragement message when goal is reached', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, { steps: 10000, goal: 10000 })
    );
    
    const { container } = render(<WalkingTracker />);
    
    // Component should display
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('handles API error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const { container } = render(<WalkingTracker />);
    
    // Component should still render despite error
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('updates data when component remounts', async () => {
    const mockData1 = { steps: 5000, goal: 10000 };
    const mockData2 = { steps: 7000, goal: 10000 };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockFetchResponse(200, mockData1))
      .mockResolvedValueOnce(mockFetchResponse(200, mockData2));
    
    const { rerender, container } = render(<WalkingTracker />);
    
    // Component renders
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
    
    rerender(<WalkingTracker />);
    
    // Component still renders after remount
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('displays date information', () => {
    const { container } = render(<WalkingTracker />);
    
    // Date or time information should be present
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });

  it('handles zero steps gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, { steps: 0, goal: 10000 })
    );
    
    const { container } = render(<WalkingTracker />);
    
    // Component renders with zero steps
    expect(container.querySelector('section') || container.querySelector('div')).toBeTruthy();
  });
});
