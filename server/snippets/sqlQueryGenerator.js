const sql = {};

/**
 *
 * @param {array} schema - array of fields
 * @param {object} payload - object of field and value pair
 * @returns SQL query
 */
sql.getUpdateQuery = (schema, payload) => {
  // return schema
  //   .reduce((query, field) => {
  //     if (field in payload) {
  //       query += field + ' = ' + "'" + payload[field] + "', ";
  //     }
  //     return query;
  //   }, '')
  //   .replace(/(,\s$)/g, '');
};

/**
 *
 * @param {string} table - name of table
 * @param {array} schema - array of fields
 * @param {object} payload - object of field and value pair
 * @returns SQL query
 */
sql.getInsertQuery = (table, schema, payload) => {
  const fields = [];
  const params = [];
  const values = [];

  for (let i = 0; i < schema.length; i++) {
    if (schema[i] in payload) {
      fields.push(schema[i]);
      params.push(`$${i + 1}`);
      values.push(payload[schema[i]]);
    }
  }

  return [
    `
  INSERT INTO ${table} (${fields.join(', ')})
  VALUES (${params.join(', ')})
  RETURNING id, date_created, ${fields.join(', ')}
  `,
    values,
  ];
};

/**
 *
 * @param {string} table - name of table
 * @param {array} schema - array of fields
 * @param {array} whereClause - array of where clauses
 * @returns SQL query
 */
sql.getSelectQuery = (table, schema, whereClause = []) => {
  let query = '';

  if (whereClause.length !== 0) {
    query = `
    SELECT ${schema.join(', ')}
    FROM ${table}
    WHERE ${whereClause.join(', ')}
    `;
  } else {
    query = `
    SELECT ${schema.join(', ')}
    FROM ${table}
    `;
  }
  return query;
};

module.exports = sql;
