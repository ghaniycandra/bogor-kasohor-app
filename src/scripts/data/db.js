import { openDB } from 'idb';

const DATABASE_NAME = 'bogor-kasohor-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved_stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const idbHelper = {
  async putStory(story) {
    if (!story.hasOwnProperty('id')) return;
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async getStory(id) {
    if (!id) return;
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async clearAllStories() {
    return (await dbPromise).clear(OBJECT_STORE_NAME);
  },
};

export default idbHelper;
