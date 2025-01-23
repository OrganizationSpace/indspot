const axios = require('axios')
class Masfob {
    constructor() {
        this.baseUrl = 'https://api.mindvisiontechnologies.com';
      //  this.baseUrl = 'http://192.168.29.233:1118';
    }



//indspot regis
async registerUser({workspace,email, password, tag }) {

    try {
    const response = await axios.post(`${this.baseUrl}/client/add/unauthorised`, {password, workspace,email, tag },
    // {headers: {
    // Authorization: token
    // }}
    );
    return response;
    } catch (error) {
    throw error;
    }
    }

     async loginUser({email, password, workspace,tag}) {
        try {
            const response = await axios.post(`${this.baseUrl}/client/login`, {email, password, workspace,tag});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async userProfile({token,url}) {
        try {
            const response = await axios.post(`${this.baseUrl}/client/profile/picture/upload`, {token,url},
             {headers: {
    Authorization: token
    }});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async userProfilefetch({token}) {
        try {
            const response = await axios.post(`${this.baseUrl}/client/profile/fetch`, {token},
             {headers: {
    Authorization: token
    }});
            return response;
        } catch (error) {
            throw error;
        }
    }

// business login
// async loginBusiness({email, password, workspace,tag}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/client/login`, {email, password, workspace,tag});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

async login({email, password, workspace,tag}) {
    try {
        const response = await axios.post(`${this.baseUrl}/agent/login`, {email, password, workspace,tag,code:"INDSPOT"});
        return response;
    } catch (error) {
        throw error;
    }
}

//User function

//     async register({workspace,
//         email,
//         password,
//         organization_name,
//         name,
//        }) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/organization/create`,{ workspace,
//             email,
//             password,
//             organization_name,
//             name});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async login({email, password, workspace}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/agent/login`, {email, password, workspace});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }
// // click login


// async clientAdd({token,email, password, tag }) {

//     try {
//     const response = await axios.post(`${this.baseUrl}/client/add`, {password, email, tag },{headers: {
//     Authorization: token
//     }});
//     return response;
//     } catch (error) {
//     throw error;
//     }
//     }

//     async clientLogin({email, password, workspace,tag}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/client/login`, {email, password, workspace,tag});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async clientList({token,tag}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/client/list`, {tag},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async clientDelete({token,email,tag}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/client/delete`, {email,tag},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }



// // Agent Function

//     async agentAdd({token,email, password, name}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/agent/add`, {email, password, name},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async agentList({token}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/agent/list`, {},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async agentRoleChange({token,email,role}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/agent/role/change`, {email, role},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async agentDelete({token,email}) {
       
//         try {
//             const response = await axios.post(`${this.baseUrl}/agent/delete`, {email},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }
    
// // Asset function

// async assetCreate({token,name,
// 				size,
// 				url,
// 				format,tags}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/asset/reference/add`, {name,
//         size,
//         url,
//         format,
//         tags},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }
// async assetList({token}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/asset/list`, {},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }
// async assetDelete({token,asset_id,url}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/asset/delete`, {url,asset_id},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

// // team function

// async teamAdd({token,email, team}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/agent/team/add`, {email, team},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }


// async teamDelete({token,email, team}) {
 
//     try {
//         const response = await axios.post(`${this.baseUrl}/agent/team/delete`, {email, team},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }


// async teamAgentAdd({token,email, team}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/agent/add/team`, {email, team},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

// async teamAgentRemove({token,email, team}) {
//     try {
//         const response = await axios.post(`${this.baseUrl}/agent/remove/team`, {email, team},{headers: {
//             Authorization: token
//         }});
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

//  // Contact function

//  async contactCreate({token,email, password, tag }) {
// try {
// const response = await axios.post(`${this.baseUrl}/customer/add`, {password, email, tag },{headers: {
// Authorization: token
// }});
// return response;
// } catch (error) {
// throw error;
// }
// }

// async contactImport({token,encodedString,tags }) {
//     try {
//     const response = await axios.post(`${this.baseUrl}/customer/import`, {encodedString,tags},{headers: {
//     Authorization: token
//     }});
//     return response;
//     } catch (error) {
//     throw error;
//     }
//     }

//     async contactList({token}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/list`, {},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async contactUpdate({token,phone_number, display_name, name,tags}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/update`, {phone_number, display_name, name,tags},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async contactDelete({token,phone_numbers}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/delete`, {phone_numbers},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

// // contact Lable function

//     async contactLableAdd({token,labels}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/label/add`, {labels},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }


//     async contactLableList({token}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/label/list`, {},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async contactLableDelete({token,labels}) {
//         try {
//             const response = await axios.post(`${this.baseUrl}/customer/label/delete`, {labels},{headers: {
//                 Authorization: token
//             }});
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

    // async contactLableAssign({token,labels,phone_number}) {
    //     try {
    //         const response = await axios.post(`${this.baseUrl}/customer/label/assign`, {labels,phone_number},{headers: {
    //             Authorization: token
    //         }});
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

}
module.exports=Masfob