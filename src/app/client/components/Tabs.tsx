import { ReactNode, useState } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultActiveTab?: string;
};

export default function Tabs({ tabs, defaultActiveTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  return (
    <div>
      <div className="flex space-x-4 m-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-lg ${
              activeTab === tab.id ? 'font-bold text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{ display: activeTab === tab.id ? 'block' : 'none' }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
