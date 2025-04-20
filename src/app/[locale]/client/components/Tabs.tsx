import { ReactNode, useState } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export default function Tabs({
  tabs,
  defaultActiveTab,
  activeTab,
  onTabChange,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const currentTab = activeTab ?? internalActiveTab;

  return (
    <div>
      <div className="flex space-x-4 m-4">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={`text-lg ${
              currentTab === tab.id
                ? 'font-bold text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() =>
              onTabChange ? onTabChange(tab.id) : setInternalActiveTab(tab.id)
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{ display: currentTab === tab.id ? 'block' : 'none' }}
          className={'h-[350px] overflow-auto'}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
