// src/model/fragment.js

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId and type are required')
    }

    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }

    if (size < 0) {
      throw new Error('Size cannot be negative');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('Invalid fragment type');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const userfragments = await listFragments(ownerId);
    if (!userfragments || userfragments.length === 0) {
      return [];
    }
    if (expand) {
      return Promise.all(userfragments.map(async (fragmentId) => Fragment.byId(ownerId, fragmentId)));
    }
    return userfragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const metadata = await readFragment(ownerId, id);
    const data = await readFragmentData(ownerId, id);
    return new Fragment({...metadata, data});
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.updated = new Date().toISOString();
    try {
      await writeFragment(this);
      let userfragments = await listFragments(this.ownerId);

      if(!userfragments || !userfragments.includes(this.id)){
        userfragments.push(this.id);
      }
      
      logger.info('Fragment saved successfully');
    } catch (error) {
      logger.error('Error saving fragment');
      throw new Error('Error saving fragment');
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (!(data instanceof Buffer)) {
        logger.Error('Something went wrong in setData()')
        throw new Error('Data must be a Buffer');
      }
      this.size = data.length;
      this.updated = new Date().toISOString();
      await writeFragmentData(this.ownerId, this.id, data);
      logger.info('Data is set successfully');
    } catch (error) {
      logger.error('Error setting the fragment data');
      throw new Error('Error setting the fragment data');
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const {type} = contentType.parse(this.type);
    return [type];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return value.startsWith('text/plain');
  }
}

module.exports.Fragment = Fragment;
