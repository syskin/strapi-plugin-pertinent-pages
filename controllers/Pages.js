"use strict";
/**
 * pages.js controller
 *
 * @description: A set of functions called "actions" of the `pages` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  meta: async (ctx) => {
    try {
      const result = await strapi.query(`pages`, `pertinent-pages`).find();
      const pages = [];
      if (result && result.length > 0) {
        const allowed = [
          `id`,
          `isFooterDisplayed`,
          `isHeaderDisplayed`,
          `isDeletable`,
          `name`,
          `path`,
          `updatedAt`,
          `createdAt`,
        ];
        result.forEach((page) => {
          const meta = Object.keys(page)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = page[key];
              return obj;
            }, {});
          pages.push(meta);
        });
      }

      ctx.send(pages);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  getById: async (ctx) => {
    try {
      const params = ctx.params;
      const result = await strapi
        .query(`pages`, `pertinent-pages`)
        .findOne({ id: params.id });

      let pageData = {};
      const allowed = [
        `id`,
        `isFooterDisplayed`,
        `isHeaderDisplayed`,
        `isDeletable`,
        `name`,
        `root`,
        `path`,
        `updatedAt`,
        `createdAt`,
      ];

      if (result)
        pageData = Object.keys(result)
          .filter((key) => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = result[key];
            return obj;
          }, {});

      ctx.send(pageData);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  path: async (ctx) => {
    try {
      const data = ctx.request.body;

      if (!data.path) {
        return ctx.badRequest(`Path must be defined`);
      }

      const result = await strapi
        .query(`pages`, `pertinent-pages`)
        .findOne({ path: data.path });

      if(!result) return ctx.badRequest(`This page doesn't exists`);

      let pageData = {};
      const allowed = [
        `isFooterDisplayed`,
        `isHeaderDisplayed`,
        `name`,
        `root`,
      ];

      pageData = Object.keys(result)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = result[key];
          return obj;
        }, {});

      ctx.send(pageData);
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Default action.
   *
   * @return {Object}
   */
  create: async (ctx) => {
    try {
      const data = ctx.request.body;

      if (!data.name || !data.path) {
        return ctx.badRequest(`Path and name must be defined`);
      }

      const checkExistingPages = await strapi
        .query(`pages`, `pertinent-pages`)
        .count({ _or: [{ name: data.name }, { path: data.path }] });

      if (checkExistingPages && checkExistingPages > 0) {
        return ctx.badRequest(`Page already exists`);
      }

      await strapi
        .query(`pages`, `pertinent-pages`)
        .create({ name: data.name, path: data.path });

      ctx.send({ message: `Page created successfully` });
    } catch (e) {
      return ctx.badRequest(`An error occured`, e);
    }
  },

  /**
   * Update page by id.
   *
   * @return {Object}
   */
  update: async (ctx) => {
    try {
      const params = ctx.params;
      const body = ctx.request.body;
      const result = await strapi
        .query(`pages`, `pertinent-pages`)
        .findOne({ id: params.id });

      if (!result) return ctx.badRequest(`No page found`);

      let data = body;
      const allowed = [
        `isFooterDisplayed`,
        `isHeaderDisplayed`,
        `name`,
        `root`,
      ];

      data = Object.keys(data)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      const updateData = await strapi
        .query(`pages`, `pertinent-pages`)
        .update({ _id: params.id }, data);

      ctx.send({ message: `Page data updated` });
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },

  /**
   * Delete page by id.
   *
   * @return {Object}
   */
  delete: async (ctx) => {
    try {
      const params = ctx.params;
      const result = await strapi
        .query(`pages`, `pertinent-pages`)
        .findOne({ id: params.id });

      if (!result) return ctx.badRequest(`No page found`);

      if (!result.isDeletable)
        return ctx.badRequest(`This page is not deletable`);

      await strapi.query(`pages`, `pertinent-pages`).delete({ id: params.id });

      ctx.send({ message: `Page data updated` });
    } catch (e) {
      return ctx.badRequest(`An error occured`);
    }
  },
};