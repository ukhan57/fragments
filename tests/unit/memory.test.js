// ./tests/unit/memory.test.js

// Fix this path to point to your project's `memory-db.js` source file
const MemoryDB = require('../../src/model/data/memory/index');

describe('Fragment Databse Tests', () => {

  // writeFragments
  test('write fragments meta data', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: 'sampleData'
    }
    const result = await MemoryDB.writeFragment(fragment);
    expect(result).toEqual(undefined);
  })

  // readFragments
  test('read fragments meta data', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: 'sampleData'
    };
    await MemoryDB.writeFragment(fragment);
    const result = await MemoryDB.readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  })

  // writeFragmentData
  test('write fragment data with buffers', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: 'sampleData'
    };
    const buffer = Buffer.from(fragment.data);
    const result = await MemoryDB.writeFragmentData(fragment.ownerId, fragment.id, buffer);
    expect(result).toEqual(undefined);
  })

  // readFragmentData
  test('write fragment data with buffers', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: 'sampleData'
    };
    const buffer = Buffer.from(fragment.data);
    await MemoryDB.writeFragmentData(fragment.ownerId, fragment.id, buffer);
    const result = await MemoryDB.readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(buffer);
  })
});
