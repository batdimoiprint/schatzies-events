import React, { useState, useEffect, useCallback } from 'react';
import { fetchPageContents, updateSectionContent } from '@/api/contents';
import { DEFAULT_SITE_CONTENT } from '@/constants/defaultContent';
import type { PageContent } from '@/constants/defaultContent';

export function useContent(pageId: string) {
  const [sections, setSections] = useState<PageContent>(() => {
    return DEFAULT_SITE_CONTENT[pageId] || {};
  });
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPageContents(pageId);
      if (data && data.length > 0) {
        const merged: PageContent = { ...(DEFAULT_SITE_CONTENT[pageId] || {}) };
        data.forEach((item) => {
          merged[item.sectionId] = {
            title: item.title,
            body: item.body,
          };
        });
        setSections(merged);
      } else {
        setSections(DEFAULT_SITE_CONTENT[pageId] || {});
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveSection = async (sectionId: string, title: string, body: string) => {
    try {
      await updateSectionContent(pageId, sectionId, title, body);
      setSections((prev) => ({
        ...prev,
        [sectionId]: { title, body },
      }));
      return true;
    } catch (error) {
      console.error('Failed to save section:', error);
      return false;
    }
  };

  return {
    sections,
    loading,
    saveSection,
    refresh: loadContent,
  };
}

export function renderContentText(text: string, styleClass: string = 'italic text-brand') {
  if (!text) return '';
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return React.createElement(
        'span',
        { key: i, className: styleClass },
        part.slice(1, -1)
      );
    }
    return part;
  });
}
