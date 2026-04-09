'use client';

import { HIKAMANI_GLOSSARY } from '@/lib/hikamani-context';

export default function GlossaryCard() {
  const glossaryEntries = Object.entries(HIKAMANI_GLOSSARY);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <h3 className="font-bold text-gray-800">語録辞典</h3>
        </div>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto scrollbar-hide">
        <div className="space-y-3">
          {glossaryEntries.map(([term, description]) => (
            <div key={term} className="group">
              <div className="flex items-start gap-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-md whitespace-nowrap">
                  {term}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 pl-1">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
