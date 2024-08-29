import { permissionForFullReferenceNumber, executeQuery } from '@defra-fish/dynamics-lib'

const executeWithErrorLog = async query => {
  try {
    return await executeQuery(query)
  } catch (e) {
    debug(`Error executing query with filter ${query.filter}`)
    throw e
  }
}

export default [
  {
    method: "GET",
    path: "/licence",
    /**
     * Handler for fetching a permission by it's full licence number.
     *
     * @param {import('@hapi/hapi').Request request} - The Hapi request object
     * @param {import('@hapi/hapi').ResponseToolkit} h - The Hapi response toolkit
     * @returns {import('@hapi/hapi').ResponseObject} - A response containing the permission or an error
     */
    handler: async (request, h) => {
      console.time('test');
      try {
        const results = await executeWithErrorLog(permissionForFullReferenceNumber(request.query.fullLicenceNumber))

        const permission = results[0]
        console.log(JSON.stringify(permission, null, 2))
        const mappedResult = {
          licenceNumber: permission.entity.referenceNumber,
          contact: {
            id: permission.expanded.licensee.entity.id,
            fullName: `${permission.expanded.licensee.entity.firstName} ${permission.expanded.licensee.entity.lastName}`
          }
        }
        console.timeEnd('test');
        return h.response(mappedResult).code(200);
      } catch (error) {
        console.error("Error fetching licence:", error);
        console.timeEnd('test');
        return h.response({ error: "Unable to fetch licence" }).code(500);
      }
    },
  }
]
