const sql = {};

/**
 *
 * @param {string} table - name of table
 * @param {object} payload - object of field and value pair
 * @param {array} whereClause - array of where clauses
 * @param {array} returnFields - array of fields to be returned
 * @returns SQL query
 */
sql.getUpdateQuery = (table, payload, whereClause, returnFields) => {
  const values = Object.keys(payload)
    .reduce((value, field) => {
      if (field === 'id') {
        return value;
      }
      const fieldVal = payload[field].replace(/'/g, "''");
      value += field + ' = ' + "'" + fieldVal + "', ";
      return value;
    }, '')
    .replace(/(,\s$)/g, '');

  return `
  UPDATE ${table}
  SET ${values}
  WHERE ${whereClause.join(', ')}
  RETURNING id, ${returnFields.join(', ')}
  `;
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

/**
 *
 * @param {string} table - name of table
 * @param {array} whereClause - array of where clauses
 * @param {array} returnFields - array of fields to be returned
 * @returns SQL query
 */
sql.getDeleteQuery = (table, whereClause = [], returnFields = []) => {
  let query = '';

  query = `
  DELETE FROM ${table}
  WHERE ${whereClause.join(', ')}
  RETURNING id, ${returnFields.join(', ')}
  `;
  return query;
};

module.exports = sql;
