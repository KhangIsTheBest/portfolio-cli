'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, User, MailCheck, AlertTriangle, RefreshCw, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { ContactResponse } from '@/types';

export default function AdminContactsPage() {
  const { locale } = useLanguage();
  const [messages, setMessages] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactResponse | null>(null);
  const [messageAlert, setMessageAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactsAdmin();
      setMessages(data);

      const token = localStorage.getItem('admin-token');
      if (token === 'mock-jwt-token-string') {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Failed to load admin contacts:', err);
      setMessageAlert({
        type: 'error',
        text: locale === 'vi' ? 'Không thể tải danh sách tin nhắn.' : 'Failed to retrieve visitor inbox messages.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [locale]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Stop row click selection event
    if (!window.confirm(locale === 'vi' ? 'Bạn có muốn xóa vĩnh viễn thư liên hệ này?' : 'Are you sure you want to permanently delete this message?')) {
      return;
    }

    setDeletingId(id);
    try {
      await apiService.deleteContact(id);
      setMessageAlert({
        type: 'success',
        text: locale === 'vi' ? 'Đã xóa thư thành công.' : 'Message deleted successfully.'
      });
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
      fetchContacts();
    } catch (err) {
      console.error('Failed to delete message:', err);
      setMessageAlert({
        type: 'error',
        text: locale === 'vi' ? 'Không thể xóa thư.' : 'Failed to delete message.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG KẾT NỐI HÒM THƯ KHÁCH...' : 'FETCHING VISITOR MAILBOX...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-mono text-text">
      
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Hòm thư liên hệ' : 'Visitor Inbox'}
          </h3>
        </div>

        {isOfflineMode && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold animate-pulse select-none">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{locale === 'vi' ? 'Mock Mode' : 'Mock Mode'}</span>
          </div>
        )}
      </div>

      {/* Messages Alerts */}
      {messageAlert && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
          messageAlert.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{messageAlert.text}</span>
        </div>
      )}

      {/* Grid: Left column list of emails, Right column detailed reading pane */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Messages List pane */}
        <div className={`lg:col-span-3 space-y-3 ${selectedMsg ? 'hidden lg:block' : 'block'}`}>
          {messages.length === 0 ? (
            <div className="p-12 border border-dashed border-border-custom rounded-2xl text-center text-secondary text-xs">
              {locale === 'vi' ? 'Hộp thư trống.' : 'No messages in inbox.'}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                    selectedMsg && selectedMsg.id === msg.id
                      ? 'bg-cyan-custom/10 border-cyan-custom/40 shadow-glow'
                      : 'bg-slate-950/15 border-border-custom hover:border-border-custom/80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-cyan-custom" />
                      <span className="text-xs font-bold text-text truncate max-w-[140px] font-sans">{msg.name}</span>
                    </div>
                    
                    <span className="text-[9px] text-secondary font-mono">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-text truncate font-sans mb-1">{msg.subject}</p>
                  <p className="text-[10px] text-secondary truncate font-sans leading-relaxed">{msg.message}</p>

                  <div className="flex justify-end mt-2.5 pt-2 border-t border-border-custom/20">
                    <button
                      onClick={(e) => handleDelete(e, msg.id)}
                      disabled={deletingId === msg.id}
                      className="p-1 rounded text-secondary hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title={locale === 'vi' ? 'Xóa thư' : 'Delete inquiry'}
                    >
                      {deletingId === msg.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detailed pane */}
        <div className={`lg:col-span-2 border border-border-custom bg-slate-950/25 rounded-2xl p-5 space-y-4 ${selectedMsg ? 'block animate-fade-in' : 'hidden lg:block'}`}>
          {selectedMsg ? (
            <div className="space-y-4">
              
              {/* Mobile Back button */}
              <div className="lg:hidden flex justify-between items-center border-b border-border-custom/30 pb-2">
                <button 
                  onClick={() => setSelectedMsg(null)}
                  className="flex items-center space-x-1.5 text-secondary hover:text-text text-[10px] uppercase font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{locale === 'vi' ? 'Trở lại' : 'Back'}</span>
                </button>

                <button
                  onClick={(e) => handleDelete(e, selectedMsg.id)}
                  className="p-1 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sender Info block */}
              <div className="space-y-2 border-b border-border-custom/30 pb-3">
                <div className="flex items-center space-x-2 text-cyan-custom">
                  <MailCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{locale === 'vi' ? 'Nội dung thư' : 'Mail Contents'}</span>
                </div>

                <div className="space-y-1 font-sans text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-secondary font-mono text-[10px] uppercase w-16">{locale === 'vi' ? 'Gửi từ:' : 'From:'}</span>
                    <span className="font-bold text-text">{selectedMsg.name}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-secondary font-mono text-[10px] uppercase w-16">Email:</span>
                    <a 
                      href={`mailto:${selectedMsg.email}`} 
                      className="text-cyan-custom hover:underline inline-flex items-center space-x-0.5"
                    >
                      <span>{selectedMsg.email}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-secondary font-mono text-[10px] uppercase w-16">{locale === 'vi' ? 'Vào lúc:' : 'Date:'}</span>
                    <span className="text-text font-mono text-[11px]">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Message content block */}
              <div className="space-y-2">
                <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block font-mono">{locale === 'vi' ? 'Tiêu đề thư:' : 'Subject:'}</span>
                <h4 className="text-xs font-bold text-text leading-relaxed font-sans">{selectedMsg.subject}</h4>
                
                <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block font-mono pt-2">{locale === 'vi' ? 'Nội dung chi tiết:' : 'Message Body:'}</span>
                <div className="p-4 rounded-xl border border-border-custom/50 bg-slate-950/45 text-text font-sans text-xs leading-relaxed whitespace-pre-wrap select-text">
                  {selectedMsg.message}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-[260px] flex flex-col items-center justify-center text-center text-secondary text-xs">
              <Mail className="w-8 h-8 text-border-custom/60 mb-2.5 animate-pulse" />
              <span>{locale === 'vi' ? 'Chọn một thư liên hệ để xem chi tiết.' : 'Select a message from the list to read.'}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
