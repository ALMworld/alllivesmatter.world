use human_passport_core::{HumanPassportIssueRequest, HumanPassportData};
use base64::{Engine as _, engine::general_purpose};
use risc0_zkvm::guest::env;
use risc0_zkvm::sha::rust_crypto::Digest;
use sha2::Sha256;


fn main() {
    let request: HumanPassportIssueRequest = env::read();

    if request.human_id_generation_data().is_empty() {
        panic!("input required. Please try again.");
    }

    let claim_commit_data = prove_my_unique_existence(&request);

    // Commit public outputs
    env::commit(&claim_commit_data);

}

fn prove_my_unique_existence(request: &HumanPassportIssueRequest) -> HumanPassportData {
    // is iris representation data stable and can deduct as unique identifier, it could be used as human id?
    // if today, I use device A from manufacturer A, and then I use device b from manufacturer B, will it still be the same?
    //  Could it be processed to be the same if my real iris is the same? neither,  current unique check seems to be distance based

    // Cryptographic hash functions vs Locality-Sensitive Hashing
    let combined = request.human_id_generation_data().as_bytes().to_vec();
    let mut hasher = Sha256::new();
    hasher.update(&combined);

    let hash_result = hasher.finalize();
    let human_id = general_purpose::URL_SAFE_NO_PAD.encode(hash_result);
    // possible associated with previous proofs as a chain?

    // just a mock, in real world, it should be locality sensitive hashing
    let mut irs_hasher = Sha256::new();
    irs_hasher.update(&request.iris_representation_data_oracle_input.as_bytes().to_vec());
    let irs_hasher_result = irs_hasher.finalize();
    let irs_hash = general_purpose::URL_SAFE_NO_PAD.encode(irs_hasher_result);

    //  Locality-Sensitive Hashing, for audit and others, for challengers
    // can derive many data, for example, by chain the previous proofs together. DUKI could be possible
    let contains_sep_char = request.real_name_oracle_input.contains("-") || request.social_id_oracle_input.contains("-");

    let ordinary_nick_name = "ordinary ".to_string() + &request.nick_name;

    let real_name_signature_input = request.real_name_oracle_input.clone() + "_" + &request.custom_secret_data;

    // envelope could be used to prove the real name and secret are indeed real data
    let mut real_name_and_secret_one_way_hasher = Sha256::new();
    real_name_and_secret_one_way_hasher.update(real_name_signature_input.as_bytes());
    let real_name_signature = general_purpose::URL_SAFE_NO_PAD.encode(real_name_and_secret_one_way_hasher.finalize());

    HumanPassportData {
        human_id,
        nick_name: request.nick_name.clone(),
        contact_email: request.contact_email.clone(),
        social_id_has_abc: true, // computation do not support this
        real_name_and_secret_signature: real_name_signature,
        social_oracle_data_proof_data: request.social_oracle_data_proof_data.clone(),
        custom_secret_has_ordinary_nick_name_inside: request.custom_secret_data.contains(&ordinary_nick_name),
        real_name_and_social_id_has_no_sep_char: !contains_sep_char,
        iris_lsh_value: irs_hash,
        metadata_1: request.metadata_1.clone(),
        metadata_2: request.metadata_2.clone(),
        biometrics_oracle_data_proof_data: request.biometrics_oracle_data_proof_data.clone(),

    }
}
