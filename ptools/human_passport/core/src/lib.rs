use std::fmt;
use serde::{Deserialize, Serialize};

/**
    *
    * main problem .soundness of Oracle input  :
    * how to prevent one person create multiple account
    * 1. can we use iris code to do some computation to generate a corresponding stable cryptographically HumanId.
    * For example when camera and light condition change, or different device, the value stays same. Searching and asking LLM, seems not.
    * Maybe that's the reason WorldCoin need collect the iris code just do avoid this problem, so they can compare the iris code data distance to prevent multiple account.
    * The Oracle Problem: need some kind of authority  to do the human_id bootstrap. also, the auditability of the bootstrap is also important.
    *
    * In this example: just use my social info to create my human_id, which it released, could be used to prove my unique existence.
 */
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct HumanPassportIssueRequest {
    // Part 1: Real name (private)
    pub real_name_oracle_input: String, // how can you be sure this is my real name? need oracle data authority to prove it, better zk-proof; like prove composition

    pub nick_name: String, // we do not care its privacy, it is public

    pub contact_email: String, //data that we do not care its privacy, it is public

    pub hire_me_as_ambassador: String, // data that we do not care its privacy, it is public

    // Part 2:  custom secret (private)
    pub custom_secret_data: String,

    // Part 3: social id (private)
    pub social_id_oracle_input: String, // oracle data authority should guarantee used  for one passport

    // Iris code data (private)
    pub iris_representation_data_oracle_input: String, // can you believe physical device get it right? a broken camera, or different light condition, or different device, will it still be the same?

    pub social_oracle_data_proof_data: String,
    pub biometrics_oracle_data_proof_data: String,

    //  like year
    pub metadata_1: String,
    // things it could prover manufacture
    pub metadata_2: String,

    // omit, many others
}


// 3 kinds of fake case
// 1. the faked computation: solved by zk-proof
// 2. the faked input: solved by oracle data authority
// 3. the faked claims:  not backed up by computation, open source and code peer review

// given the proof in (human_passport.json/human_passport.bin):
// if it pass integrity check, it means type-1 fake are excluded

// but does human passport support the blow claims:
// claim 1: human_id is generated using sha256 of human_id_generation_data: which like {real_name_input}_{secret}_{social_id_input}
// -- true
// claim 2: the real_name and social_id are indeed real data. nothing is absolute, 'oracle data' which need consistently verified by DUKI system
// -- could have type-2 fake
// claim 3: real_name and secret and social_id data do not have '-' in it.
// -- true
// claim 4: custom secret (never fully show), contains string 'ordinary KindKang'
// -- true
// claim 5: social_id has 'abc' in it
// -- false (type-3)

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct HumanPassportData {
    pub human_id: String, // type-2
    pub nick_name: String, // do not care
    pub contact_email: String,

    pub custom_secret_has_ordinary_nick_name_inside: bool, // trustful
    pub real_name_and_social_id_has_no_sep_char: bool, // trust full
    pub iris_lsh_value: String, // one-way feature for example
    pub social_id_has_abc: bool, // type-3

    // signature of (real_name +  custom_secret_data)
    pub real_name_and_secret_signature: String,

    pub social_oracle_data_proof_data: String,
    pub biometrics_oracle_data_proof_data: String,

    pub metadata_1: String,
    pub metadata_2: String,
    // omit, many others
}


impl HumanPassportIssueRequest {
    // Computed property for human_id_generation_data
    //  could we derive some stable bio-metric feature, and put it in human_id? or just random one?
    //  maybe do not need human_id_generation_data, any unique string is ok?
    pub fn human_id_generation_data(&self) -> String {
        format!("{}-{}-{}", self.real_name_oracle_input, self.custom_secret_data, self.social_id_oracle_input)
    }
}

