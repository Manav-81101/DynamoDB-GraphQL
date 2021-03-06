require("dotenv").config();
const AWS = require("aws-sdk");

const config = {
  region: process.env.DYNAMO_REGION_NAME,
  endpoint: process.env.DYNAMO_END_POINT_NAME,
};
AWS.config.update(config);
//update env variables

const docClient = new AWS.DynamoDB.DocumentClient();

const fetchOneKey = async (tableName, key, value) => {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: tableName,
      Key: {
        [key]: value,
      },
    };
    docClient.get(params, function (err, data) {
      if (err) resolve("Error " + err);
      else resolve(data.Item);
    });
  });
};
const fetchAll = async (tableName) => {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: tableName,
    };
    docClient.scan(params, function (err, data) {
      const results = [];
      if (err) {
        resolve(
          "Unable to read item. Error JSON:" + JSON.stringify(err, null, 2)
        );
      } else {
        results.push(...data.Items);
      }
      resolve(results);
    });
  });
};

const addItem = ({ name, email, phoneNumber }) => {
  return new Promise((resolve, reject) => {
    var input = {
      TableName: "users",
      Item: {
        name,
        email,
        phoneNumber,
      },
    };
    docClient.put(input, function (err, data) {
      if (err) {
        resolve(
          "Unable to add item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        resolve(input.Item);
      }
    });
  });
};

const modifyItem = ({ email, phoneNumber }) => {
  var params = {
    TableName: "users",
    Key: {
      email,
    },
    UpdateExpression: "set phoneNumber = :p",
    ExpressionAttributeValues: {
      ":p": phoneNumber,
    },
    ReturnValues: "UPDATED_NEW",
  };
  //   var params = {
  //     TableName: "users",
  //     Key: {
  //       email,
  //     },
  //     UpdateExpression: "set name = :n, phoneNumber = :p",
  //     ExpressionAttributeValues: {
  //       ":n": newName,
  //       ":p": phoneNumber,
  //     },
  //     ReturnValues: "UPDATED_NEW",
  //   };
  docClient.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
};

const deleteItem = ({ email }) => {
  var params = {
    TableName: "users",
    Key: {
      email,
    },
  };
  docClient.delete(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
};

module.exports = {
  fetchOneKey,
  fetchAll,
  addItem,
  modifyItem,
  deleteItem,
};
