import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  ProgressBar,
  Modal,
  Slider,
  Toggle,
  Dropdown,
  Tooltip,
  Toast,
  Skeleton,
  ConfettiAnimation,
} from '@/components/common';

export const ComponentShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [toggleValue, setToggleValue] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('korean');
  const [showToast, setShowToast] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Component Library Showcase</h1>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Multiple variants and sizes with loading states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="large">Primary Button</Button>
              <Button variant="secondary" size="medium">Secondary Button</Button>
              <Button variant="outline" size="small">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" loading>Loading...</Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Bars</CardTitle>
            <CardDescription>Animated progress indicators with labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar current={2450} total={3000} color="blue" showLabel animated />
            <ProgressBar current={7} total={10} color="green" showLabel />
            <ProgressBar current={3} total={5} color="yellow" />
            <ProgressBar current={8} total={10} color="purple" showLabel />
          </CardContent>
        </Card>

        {/* Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Slider</CardTitle>
            <CardDescription>Language blend level slider with marks</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              value={sliderValue}
              min={0}
              max={10}
              onChange={setSliderValue}
              label="Language Blend Level"
              showValue
              marks={[
                { value: 0, label: '100% English' },
                { value: 5, label: '50/50' },
                { value: 10, label: '100% Korean' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle</CardTitle>
            <CardDescription>Switch for boolean settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Toggle checked={toggleValue} onChange={setToggleValue} label="Show Hints" />
          </CardContent>
        </Card>

        {/* Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown</CardTitle>
            <CardDescription>Language selection dropdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Dropdown
              value={dropdownValue}
              options={[
                { value: 'korean', label: 'Korean' },
                { value: 'mandarin', label: 'Mandarin' },
              ]}
              onChange={setDropdownValue}
              placeholder="Select Language"
            />
          </CardContent>
        </Card>

        {/* Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip</CardTitle>
            <CardDescription>Hover over the word to see translation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tooltip content="This is Korean for 'basketball'" position="top">
              <span className="cursor-help text-primary-500 font-semibold text-2xl">농구</span>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Loading</CardTitle>
            <CardDescription>Loading placeholders for content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={100} animation="wave" />
            <div className="flex gap-4">
              <Skeleton variant="circular" width={64} height={64} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal, Toast, Confetti Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
            <CardDescription>Click buttons to test modal, toast, and confetti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setShowToast(true)}>Show Toast</Button>
              <Button variant="outline" onClick={() => setCelebrate(true)}>Celebrate!</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Test Modal">
        <p className="text-child-sm text-gray-700">
          This is a modal dialog. Press Escape or click the close button to dismiss.
        </p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setModalOpen(false)}>Close</Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast
          message="+150 XP earned!"
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Confetti */}
      <ConfettiAnimation
        trigger={celebrate}
        duration={3000}
        onComplete={() => setCelebrate(false)}
      />
    </div>
  );
};
