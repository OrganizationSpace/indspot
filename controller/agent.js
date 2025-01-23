const Preference_ = require("../schema/preference");
const Slot_ = require("../schema/slot");
const { sign, attestation } = require('../function/signature')

const axios = require('axios')

class Agent {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
    //this.baseUrl = "https://api.mindvisiontechnologies.com";
    //  this.baseUrl = 'http://192.168.29.233:1118';
  }

  async initPreference({ workspace }) {
    try {
      const result = await Preference_({
        workspace: workspace,
        is_set:false
       }).save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async exiting({ workspace }) {
    try {
      const result = await Preference_.findOne({ workspace });
      return result;
    } catch (error) {
      throw error;
    }
  }


  async login({ email, password, tag }) {
    try {
      const inputData = {
        email,
        password,
        tag,
        code: "PROD001",	
			};
	
			const payload = JSON.stringify(inputData);
			const signature = sign(payload);
      const response = await axios.post(`${this.baseUrl}/agent/login`,inputData,
      {
        headers: {
          "x-webhook-signature":signature
        },
      }
    );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async cancelSlot({ workspace,eid,sid }) {
    try {
      const result = await Slot_.findOneAndUpdate(
        {
          workspace: workspace,
          eid: eid,
          _id: sid,
        },
        {
          $set: {
            is_available: true,
            status: "CANCELLED_BY_HOST",
          },
        },{new:true}
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async organizationInfo({token}) {
    try {
  const payload ={}
  const data = JSON.stringify(payload);
  const signature = sign(data)

  
        const response = await axios.post(`${this.baseUrl}/organization/info`, payload,
  // {headers: {
        //     Authorization: token
        // }}
   {
    headers: {
      "Authorization": token,
      "x-webhook-signature":signature
    },
  }
);
        return response;
    } catch (error) {
        throw error;
    }
}

}
module.exports = Agent;
