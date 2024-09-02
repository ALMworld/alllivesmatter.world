# Human Passport Toy Program

A toy program that helps me think about how to distribute DUKI, as described in AllLivesMatter.World.
Heavy lifting done by zkVM,  inspiration from  WorldID

Kudos to [zkVM](https://www.risczero.com/) and [WorldID](https://worldcoin.org) teams.



There's nothing fancy here.
Tweaking this program helped me think and express my point clearly. 
My thoughts became clearer after playing with this program, and I am pretty sure that a blockchain-based DUKI system is possible.

## Quick Start
I already generate an human_password for me, in the `human_passport.bin` and `human_passport.json` files. There are the same, just the an different format for the same thing.
```bash
cargo run --release
```
It zk-verify the passport integrity and prints passport public data. 

```
HumanId: -4k7lEJJeVV480eVe9HCoCTDwVI1zMPQMswSaJf6F0s
NickName: KindKang
ContactEmail: kindkang@alllivesmatter.world
SecretHasOrdinaryNickName: true
realNameAndSocialIdHasNoSepChar: true
socialOracleDataProofData: social_oracle_data_proof_data_123
realNameAndSecretSignature: BkO42IggGlL7p4Kbama3uKK8jnV7nQ6-7lJR8NTHSNI
biometricsOracleDataProofData: biometrics_oracle_data_proof_data_ref_456
Iris Hash: nlKypitNbF2cq67HkFXbAnrlbRP9bCZpkGNmhVoINWQ
SocialIdHasAbc: true
Metadata 1: 20240827
Metadata 2: AllLivesMatter.World
```

###  Note
Since I have limited blockchain knowledge and no experience developing Web3 apps yet, my interpretation or understanding may contain errors or issues. I'd appreciate if you could point them out.

Blow is just my naive imagination for the web3 with DUKI that could exist, which behaves with Kindness, Fairness and DUKI.
It relies on  freedom of criticism, ensuring that authorities truly fulfill their responsibilities.

###  Three Elements in DUKI context
#### [Human Unique Features]
are characteristics that can help uniquely identify an individual. These can be inherent, like biometric data; assigned, such as government-issued IDs; or user-created, like passwords or secret phrases. If features that has an stable digital representation, they could be used as components of a passport id, while other features can be used to enhance uniqueness in the system. 
Analogy: the Human Passport is like a 'username', while these Human Unique Features are like a 'password'.

#### [Oracle Data] 
is a digital representation of Human Unique Features used as input for Human Passport. This representation could potentially be faulty or inaccurate, and requires consistent proof, preferably through zero-knowledge proofs. This ongoing proof helps maintain the integrity of the system. 

#### [Oracle Data Authority]
is an authority responsible for the correctness of Oracle Data by doing proof . It should always welcome criticisms and when criticism occurs, it is required to conduct further validation to prove its authenticity, in this case to ensure Oracle Data always accurately represents Human Unique Features.

### Human Passport Issuance: 
- Using a device implemented by manufacturers that adheres to established standards and utilizes my Human Unique Feature, I generate a Human Passport. This passport is essentially a receipt in zkVM terms, generated through zero-knowledge computation. It claims my unique existence with the ID '-4k7lEJJeVV480eVe9HCoCTDwVI1zMPQMswSaJf6F0s'. Along with other metadata such as hardware manufacturer information and one-way features derived from other data. 
- This Human Passport together with other data is placed on-chain, making it publicly accessible and declaring my existence and uniqueness to the world. My future activities, such as DUKI claims, challenges to others' IDs, and proof history, can also be associated with this ID. 
- After the generation process, I receive my passport. It's important to note that nothing except the Human Passport should leave the device, and no data should remain on the device after the process is complete. Remember that oracle data authority should prevent me issue two passports. Also if well-implemented, the zero-knowledge nature of this process could maintain privacy and prevent any direct link between my real-world identity and my on-chain Human Passport. The completeness of zero-knowledge proofs ensures that I could easily prove ownership when needed. It also seems to support passport reissuance if I proven my full ownership of the previous passport. 


### Human Passport Usage: 
It serves as a passport to the Web3 world . The Human Passport acts as proof that the one behind this is a real person, which anyone can verify without accessing any private information. The Human Passport acts as proof that the one behind it is a real person, which anyone can verify without accessing any private information. Any blockchain application can check the integrity of the passport and may request a simple proof of ownership and gain confidence that a human, rather than a bot, is behind it. This system treats all humans and all apps equally because there's no way to discriminate or show favoritism, even if one wanted to. It's a worldwide, anonymous system where all lives matter worldwide equally.
If compare it with a MetaMask wallet, for example, the passport could also signify that a unique person is behind it. This person could use secret data and human-unique features together to prove ownership instead of private keys only.

### Human Passport Soundness:
The zk-verify and simple proof process conducted by other blockchain applications alone is insufficient. The DUKI system must continuously check the credibility of the oracle data. 
- Whenever I attempt to claim a DUKI, the system should always verify the credibility of the oracle data. In such cases, it should request another proof using [Human Unique Features], possibly through a different standard implementation. This process aims to determine whether the oracle data used was generated by a faulty device or if someone deliberately forged the data to claim multiple DUKIs, acting uncooperatively. 
- Anyone can challenge my passport by staking coins and requesting more rigorous proof, such as asking the oracle data authority to perform additional verification. 
- Independent watchers could also leverage public blockchain data to detect potential fraud. For instance, if a whistleblower discovers multiple accounts with suspiciously similar iris LSH (Locality-Sensitive Hashing) hashes, they could challenge these accounts to perform a proof simultaneously. This is based on the principle that if these accounts belong to the same person, simultaneous proof cannot be performed for all accounts at once. 

If I successfully prove my uniqueness, I will receive the staked coins, and my passport gains more credibility. If I fail, the challenger receives a significant bonus from the system, which includes the coins staked by the oracle data authority and the penalty I incurred. I'm then excluded from the kindness system until I've paid my penalty, and my credibility starts at zero, allowing for forgiveness.