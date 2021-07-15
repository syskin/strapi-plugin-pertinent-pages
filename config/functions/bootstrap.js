module.exports = async () => {
  try {
    const permOrm = strapi.query(`permission`, `users-permissions`);
    const pluginPermissions = await permOrm.find({ type: `pertinent-pages` });
    for (const currentPermission of pluginPermissions) {
      if (currentPermission.role.type === `authenticated`) {
        strapi.log.info(
          `Allowing authenticated to call ${currentPermission.controller}.${currentPermission.action}`
        );
        permOrm.update(
          { id: currentPermission.id },
          { ...currentPermission, enabled: true }
        );
        continue;
      }

      // permission is for public
      const isReadEndpoint = [`path`].includes(currentPermission.action);
      if (isReadEndpoint) {
        strapi.log.info(
          `Allowing public to call ${currentPermission.controller}.${currentPermission.action}`
        );
        permOrm.update(
          { id: currentPermission.id },
          { ...currentPermission, enabled: true }
        );
        continue;
      }
    }

    const homePage = await strapi
      .query(`pages`, `pertinent-pages`)
      .find({ path: `/` });
    if (homePage.length === 0) {
      const data = {
        name: `Home`,
        path: `/`,
        root: [],
        isDeletable: false,
      };
      await strapi.query(`pages`, `pertinent-pages`).create(data);
      strapi.log.info(`Home page was successfully created.`);
    }
  } catch (e) {
    strapi.log.error(`An error occured : `, e);
  }
};
