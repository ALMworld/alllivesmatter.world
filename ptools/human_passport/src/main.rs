use human_passport_core::{HumanPassportData, HumanPassportIssueRequest};
use std::fs::File;
use std::io::{Read, Write};
use anyhow::{Context, Result};


// HUMAN_PASSPORT_ELF is computation ELF file, HUMAN_PASSPORT_ID is the ID of the computation
use human_passport_methods::{HUMAN_PASSPORT_ELF, HUMAN_PASSPORT_ID};

use rand::prelude::*;
use risc0_zkvm::{default_prover, serde::from_slice, ExecutorEnv, Receipt};

enum MainRunType {
    ProofComputationGeneratingReceipt, //proof computation that generate receipt at the same time
    VerifyComputationUsingReceipt,
}
enum ReceiptSerializationType {
    Json,   // from  serialized JSON
    Binary, // from serialized binary
    Memory, // calculate proof in memory (the generated proof is not saved)
}

fn main() -> Result<()> {
    let mut rng = StdRng::from_entropy();
    let mut salt = [0u8; 32];
    rng.fill_bytes(&mut salt);

    // Oracle data should be continuously and consistently proved to ensure it accurately represents the real world and subject to challenge at any time.
    // This ongoing proof process should always require additional proofs when necessary.
    // For example:
    // - A person's real name should be continuously provable by a trusted third party, such as a government agency.
    // - The oracle irisCode  should be repeatedly proved when claiming DUKI using different iris code scanners from various manufacturers to ensure ongoing accuracy.
    // - In cases where two iris codes are similar and potentially fraudulent, we can require both individuals to undergo simultaneous proofs. This serves as an ongoing proof to continually confirm that the two persons are indeed real and unique.

    let computation_type = MainRunType::ProofComputationGeneratingReceipt;
    // let computation_type = MainRunType::VerifyComputationUsingReceipt;
    let serialization_type = ReceiptSerializationType::Binary;
    // let serialization_type = ReceiptSerializationType::Json;


    match computation_type {
        MainRunType::ProofComputationGeneratingReceipt => {
            let mut request = HumanPassportIssueRequest {
                real_name_oracle_input: "social_privacy_data".to_string(),
                nick_name: "KindKang".to_string(),
                contact_email: "kindkang@alllivesmatter.world".to_string(),
                hire_me_as_ambassador: "hire me as ambassador".to_string(),
                custom_secret_data: "ordinary KindKang_".into(),
                metadata_1: "20240826".into(),
                metadata_2: "AllLivesMatter.World".into(), // could include Orb, VR manufacturer, etc.
                iris_representation_data_oracle_input: "EveryoneUnforgableSecretData".to_string(),
                biometrics_oracle_data_proof_data: "ref_iris_and_other_data_proof_345".to_string(),
                social_id_oracle_input: "123".to_string(),
                social_oracle_data_proof_data: "ref_social_proof_123".to_string(),
            };
            let secret_local_data = data_used_in_all_lives_matter_world();
            if secret_local_data.is_ok() {
                request = secret_local_data.unwrap();
            }
            let receipt_of_computation = human_passport_using_oracle_data_that_is_freely_criticizable_and_demands_self_validating(request);
            verify_passport_integrity(&receipt_of_computation);
            display_passport_values(&receipt_of_computation);
            save_receipt_of_proof(serialization_type, receipt_of_computation)
        }

        MainRunType::VerifyComputationUsingReceipt => {
            let receipt_of_computation =
                load_receipt_from_file(serialization_type).expect("Failed to load receipt");
            verify_passport_integrity(&receipt_of_computation);
            display_passport_values(&receipt_of_computation);
            Ok(())
        }
    }

}

fn data_used_in_all_lives_matter_world() -> Result<HumanPassportIssueRequest> {
    let mut file = File::open("./../../data/oracle_data_that_is_freely_criticizable_and_demands_self_validating.json")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    // Parse the JSON data into our struct
    let request: HumanPassportIssueRequest = serde_json::from_str(&contents)?;

    return Ok(request)


}

fn save_receipt_of_proof(
    serialization_type: ReceiptSerializationType,
    receipt_of_computation: Receipt,
) -> Result<()> {
    match serialization_type {
        ReceiptSerializationType::Json => {
            // Serialize to JSON
            let json = serde_json::to_string_pretty(&receipt_of_computation)?;
            // Save to file
            let mut file = File::create("human_passport.json")?;
            Ok(file.write_all(json.as_ref())?)
        }
        ReceiptSerializationType::Binary => {
            let serialized = bincode::serialize(&receipt_of_computation)?;
            // Save to file
            let mut file = File::create("human_passport.bin")?;
            Ok(file.write_all(&serialized)?)
        }
        ReceiptSerializationType::Memory => {
            Ok(())
        }
    }
}


// in this case, receipt is the passport
fn load_receipt_from_file(serialization_type: ReceiptSerializationType) -> Option<Receipt> {
    match serialization_type {
        ReceiptSerializationType::Json => {
            // Read from file
            let mut file = match File::open("human_passport.json") {
                Ok(file) => file,
                Err(_) => return None,
            };
            let mut serialized = String::new();
            if file.read_to_string(&mut serialized).is_err() {
                return None;
            }
            match serde_json::from_str(&serialized) {
                Ok(loaded_receipt) => Some(loaded_receipt),
                Err(_) => None,
            }
        }
        ReceiptSerializationType::Binary => {
            // Read from file
            let mut file = match File::open("human_passport.bin") {
                Ok(file) => file,
                Err(_) => return None,
            };
            let mut serialized = Vec::new();
            if file.read_to_end(&mut serialized).is_err() {
                return None;
            }
            match bincode::deserialize(&serialized) {
                Ok(receipt_of_proof) => Some(receipt_of_proof),
                Err(_) => None,
            }
        }
        ReceiptSerializationType::Memory => None,
    }
}

fn human_passport_using_oracle_data_that_is_freely_criticizable_and_demands_self_validating(request: HumanPassportIssueRequest) -> Receipt {
    let env = ExecutorEnv::builder()
        .write(&request)
        .unwrap()
        .build()
        .unwrap();

    // Obtain the default prover.
    let prover = default_prover();

    // Produce a receipt by proving the specified ELF binary.
    let receipt = prover.prove(env, HUMAN_PASSPORT_ELF).unwrap().receipt;

    // receipt.journal.decode().unwrap();

    return receipt;
}

fn display_passport_values(receipt: &Receipt) {
    // let journal_data = receipt.journal.decode().expect("Journal decode failed");
    // let mut journal = receipt.journal.decode();
    let journal_data: HumanPassportData = receipt.journal.decode().expect("Journal decode failed");

    println!("HumanId: {}", journal_data.human_id);
    println!("NickName: {}", journal_data.nick_name);
    println!("ContactEmail: {}", journal_data.contact_email);
    println!("SecretHasOrdinaryNickName: {}", journal_data.custom_secret_has_ordinary_nick_name_inside);
    println!("realNameAndSocialIdHasNoSepChar: {}", journal_data.real_name_and_social_id_has_no_sep_char);
    println!("socialOracleDataProofData: {}", journal_data.social_oracle_data_proof_data);
    println!("biometricsOracleDataProofData: {}", journal_data.biometrics_oracle_data_proof_data);
    println!("Iris Hash: {}", journal_data.iris_lsh_value);
    println!("SocialIdHasAbc: {}", journal_data.social_id_has_abc);
    println!("Metadata 1: {}", journal_data.metadata_1);
    println!("Metadata 2: {}", journal_data.metadata_2);

    // omit
}

fn verify_passport_integrity(receipt: &Receipt) {
    match receipt.verify(HUMAN_PASSPORT_ID) {
        Ok(_) => println!("Proof verified successfully!"),
        Err(e) => panic!("Proof verification failed: {:?}", e),
    }
}