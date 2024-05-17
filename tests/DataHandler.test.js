const DataHandler = require('../classes/DataHandler');

describe('DataHandler', () => {
  let handler;

  beforeEach(() => {
    handler = new DataHandler();
  });

  test('createEntry should create entry in data', () => {
    handler.createEntry(null, 'path/to/new', {});
    expect(handler.data).toHaveProperty('path');
    expect(handler.data.path).toHaveProperty('to');
    expect(handler.data.path.to).toHaveProperty('new');
  });

  test('listEntries should log entries', () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    handler.createEntry(null, 'a/b/c', {});
    handler.listEntries();
    expect(consoleSpy).toHaveBeenCalledWith('a');
    expect(consoleSpy).toHaveBeenCalledWith(' b');
    expect(consoleSpy).toHaveBeenCalledWith('  c');
    consoleSpy.mockRestore();
  });

  test('deleteEntry should delete an existing entry', () => {
    handler.createEntry(null, 'path/to/delete', {});
    expect(handler.data).toHaveProperty('path');
    expect(handler.data.path).toHaveProperty('to');
    expect(handler.data.path.to).toHaveProperty('delete');

    handler.deleteEntry('path/to/delete');
    expect(handler.data.path.to).not.toHaveProperty('delete');
  });

  test('deleteEntry should handle non-existent entries', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    handler.deleteEntry('N');
    expect(handler.data).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('moveEntry should move an existing entry to a new path', () => {
    handler.createEntry(null, 'A/B/C', {});
    handler.createEntry(null, 'G', {});

    handler.moveEntry(null, 'A/B G');

    expect(handler.data).toEqual({
      A: {},
      G: {
        B: {
          C: {}
        }
      }
    });
  });

  test('moveEntry should handle non-existent source path', () => {
    handler.moveEntry(null, 'N G');

    expect(handler.data).toEqual({});
  });

  test('moveEntry should handle non-existent destination path', () => {
    handler.createEntry(null, 'A/B', {});

    handler.moveEntry(null, 'A/B N');

    expect(handler.data).toEqual({
      A: {
        B: {}
      }
    });
  });
});
