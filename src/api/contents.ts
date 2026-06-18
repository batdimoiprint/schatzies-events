import axiosInstance from './axios-instance';

export interface SiteSection {
  pageId: string;
  sectionId: string;
  title: string;
  body: string;
}

export async function fetchPageContents(pageId: string): Promise<SiteSection[]> {
  try {
    const response = await axiosInstance.get(`/contents/${pageId}`);
    return response.data || [];
  } catch (error) {
    console.warn(`Failed to fetch page contents for ${pageId}, using local storage fallback.`, error);
    const saved = localStorage.getItem(`site-content-${pageId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }
}

export async function updateSectionContent(
  pageId: string,
  sectionId: string,
  title: string,
  body: string
): Promise<SiteSection> {
  const payload = { title, body };
  try {
    const response = await axiosInstance.put(`/contents/${pageId}/${sectionId}`, payload);
    // Sync with localStorage as fallback/cache
    updateLocalCache(pageId, sectionId, title, body);
    return response.data;
  } catch (error) {
    console.warn(`Failed to update section content for ${pageId}/${sectionId}, saving to local storage.`, error);
    return updateLocalCache(pageId, sectionId, title, body);
  }
}

function updateLocalCache(pageId: string, sectionId: string, title: string, body: string): SiteSection {
  const saved = localStorage.getItem(`site-content-${pageId}`);
  const sections: SiteSection[] = saved ? JSON.parse(saved) : [];
  const index = sections.findIndex((s) => s.sectionId === sectionId);
  const now = new Date().toISOString();
  const updatedItem = {
    pageId,
    sectionId,
    title,
    body,
    createdAt: now,
    updatedAt: now,
  };
  if (index >= 0) {
    sections[index] = updatedItem;
  } else {
    sections.push(updatedItem);
  }
  localStorage.setItem(`site-content-${pageId}`, JSON.stringify(sections));
  return updatedItem;
}
