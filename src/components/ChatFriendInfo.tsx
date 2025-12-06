import React, { useState } from 'react';
import { X, FileText, Image, Link, Trash2, User } from 'lucide-react';

export type FileItem = { id: string | number; name: string; size?: string; when?: string };
export type LinkItem = { id: string | number; title: string; url: string };

interface ChatFriendInfoProps {
  friendName?: string;
  initial?: string;
  status?: 'Online' | 'Offline';
  files?: FileItem[];
  images?: string[]; // image urls or placeholders
  links?: LinkItem[];
  onDelete?: () => void;
}

const ChatFriendInfo: React.FC<ChatFriendInfoProps> = ({
  friendName = 'Sarah Johnson',
  initial = 'S',
  status = 'Online',
  files = [
    { id: 1, name: 'Project_Proposal.pdf', size: '2.3 MB', when: '2 days ago' },
    { id: 2, name: 'Meeting_Notes.docx', size: '156 KB', when: '5 days ago' },
    { id: 3, name: 'Budget_2024.xlsx', size: '478 KB', when: '1 week ago' },
  ],
  images = [],
  links = [
    { id: 1, title: 'Portfolio Website', url: 'https://sarahjohnson.com' },
    { id: 2, title: 'GitHub Profile', url: 'https://github.com/sarahj' },
    { id: 3, title: 'LinkedIn', url: 'https://linkedin.com/in/sarahj' },
  ],
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  const openPanel = () => setOpen(true);
  const closePanel = () => setOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Friend Details Panel</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">Click the button below to open the sliding panel from the right side. The panel contains friend information, shared files, images, links, and action buttons.</p>
          <button
            onClick={openPanel}
            className="inline-flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition"
            aria-expanded={open}
          >
            <User size={16} />
            <span className="whitespace-nowrap">Open Friend Details</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closePanel}
        aria-hidden={!open}
      />

      {/* Side Panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out w-full sm:w-1/2 lg:w-1/3 bg-white shadow-xl flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Friend Details</h2>
          <button
            onClick={closePanel}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 flex-1">
          {/* Profile */}
          <div className="text-center mb-6 pb-4 border-b">
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3" style={{ background: 'linear-gradient(135deg,#4caf50,#81c784)' }}>
              {initial}
            </div>
            <div className="text-lg font-semibold text-gray-800">{friendName}</div>
            <div className={`text-sm ${status === 'Online' ? 'text-green-600' : 'text-gray-500'}`}>{status}</div>
          </div>

          {/* Files */}
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">Files</h3>
            </div>
            <div className="space-y-3">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{f.name}</div>
                    <div className="text-xs text-gray-500">{f.size} • {f.when}</div>
                  </div>
                  <div className="text-xs text-gray-400">Download</div>
                </div>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Image className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">Images</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(images.length ? images : [
                'placeholder-1',
                'placeholder-2',
                'placeholder-3',
                'placeholder-4',
                'placeholder-5',
                'placeholder-6',
              ]).map((_, idx) => (
                <div key={idx} className="aspect-square rounded-lg bg-linear-to-br from-gray-200 to-gray-300 hover:scale-105 transition overflow-hidden" />
              ))}
            </div>
          </section>

          {/* Links */}
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Link className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">Links</h3>
            </div>
            <div className="space-y-3">
              {links.map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition">
                  <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center">🔗</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{l.title}</div>
                    <div className="text-xs text-gray-500 truncate">{l.url.replace(/^https?:\/\//, '')}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <footer className="p-4 border-t bg-gray-50">
          <button
            onClick={() => { onDelete?.(); closePanel(); }}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <Trash2 size={16} />
              <span>Delete Friend</span>
            </div>
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default ChatFriendInfo;
