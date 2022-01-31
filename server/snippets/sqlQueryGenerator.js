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
 * @param {object} orderBy - object with fields and sorting option property
 * @returns SQL query
 */
sql.getSelectQuery = (
  table,
  schema,
  whereClause = [],
  orderBy = { fields: [], option: 'ASC' }
) => {
  let query = '';

  query = `
    SELECT ${schema.join(', ')}
    FROM ${table}
    `;

  if (whereClause.length !== 0) {
    query = `
    ${query}
    WHERE ${whereClause.join(', ')}
    `;
  }

  if (orderBy.fields.length !== 0) {
    query = `
    ${query}
    ORDER BY ${orderBy.fields.join(', ')} ${option}
    `;
  }
  return query;
};

/**
 *
 * @param {array} schema - array of object with table / field array pair
 * @param {array} join - array of object with table / field pairs
 * @param {array} whereClause - array of object with table / whereCalues array pair
 * @returns SQL query
 */

// const schema = [
//   { table1: ['f1', 'f2', 'f4'] },
//   { table2: ['f1', 'f3'] },
//   { table3: ['f1', 'f5'] },
// ];
// const join = [
//   { table1: 'f1', table2: 'f1' },
//   { table2: 'f1', table3: 'f1' },
// ];

// const whereClause = [{ table1: [`f2 = 2`, `f4 = 4`] }, { table2: [`f3 = 3`] }];

sql.getSelectJoinQuery = (schema, join, whereClause = []) => {
  let query = '';

  const alias = {};

  const selectVal = schema
    .reduce((str, table, idx) => {
      const tableName = Object.keys(table)[0];
      alias[tableName] = `alias${idx}`;
      table[tableName].forEach((field, idx) => {
        str += `${alias[tableName]}.${field}, `;
      });
      return str;
    }, '')
    .replace(/(,\s$)/g, '');

  query += `SELECT ${selectVal} FROM ${Object.keys(schema[0])[0]} ${
    alias[Object.keys(schema[0])[0]]
  }`;

  const joinVal = join.reduce((str, j) => {
    str += 'LEFT JOIN ';
    const tables = Object.keys(j);
    for (let i = tables.length - 1; i >= 0; i--) {
      if (i === tables.length - 1)
        str += `${tables[i]} ${alias[Object.keys(j)[i]]} ON ${
          alias[tables[i]]
        }.${j[tables[i]]} = `;
      else str += `${alias[tables[i]]}.${j[tables[i]]} `;
    }
    return str;
  }, '');

  query = `${query} ${joinVal}`;

  if (whereClause.length > 0) {
    const whereClauseVal = whereClause
      .reduce((str, table) => {
        const tableName = Object.keys(table)[0];
        table[tableName].forEach((field) => {
          str += `${alias[tableName]}.${field}, `;
        });
        return str;
      }, 'WHERE ')
      .replace(/(,\s$)/g, '');

    query = `${query} ${whereClauseVal}`;
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
