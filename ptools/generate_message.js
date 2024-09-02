import { readFile } from 'fs/promises';
import path from 'path';



// Email generator function
function generateMessage(human_goodness_works) {
    return `
  Subject: Your goodness inspired AllLivesMatter.World advocacy

Dear ${human_goodness_works.name},

I hope this message finds you well. My name is KindKang, the initial advocate of AllLivesMatter.World, and I am writing to inform you about this recently launched advocacy initiative which references your ${human_goodness_works.works}.

The advocacy, AllLivesMatter.World, is a global call for humanity and compassion, advocating for 'Kindness First, Fairness Always, and DUKI In Action'. DUKI stands for 'Decentralized Universal Kindness Income'. ${human_goodness_works.works_contribution}.

Your ${human_goodness_works.works_type} have been invaluable in helping launch this initiative and enriching the content of our advocacy. I wanted to personally reach out, inform you about this, and express my appreciation for your contribution.

If you're interested, I invite you to visit the advocacy website at https://www.alllivesmatter.world. Additionally, if you have any questions or concerns about how your goodness has been referenced, please don't hesitate to let me know.

Thank you again for your inspiring ${human_goodness_works.works_type}. Your inspiration  have been instrumental in advancing the understanding of 'alllivesmatter.world' and supporting the advocacy efforts.

Best regards,
KindKang
Advocate for ALL LIVES MATTER WORLD
www.alllivesmatter.world
    `;
}

// Generate emails for all authors
function generateMessages(human_goodness_works_list) {
    return human_goodness_works_list.map(human_goodness_works => generateMessage(human_goodness_works));
}

// Main function to run the script
async function main() {
    const dataFilePath = path.join(".", '..', 'data', 'human_goodness_works_list.json');

    // Define the array of authors and their works
    let human_goodness_works_list = [
        {
            name: "X",
            works: "'",
            works_type: "'",
            works_contribution: "",
        }
    ]

    try {
        const rawData = await readFile(dataFilePath, 'utf8');
        human_goodness_works_list = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading or parsing the data file:', error);
        process.exit(1);
    }

    // Generate and print emails
    const private_message_list = generateMessages(human_goodness_works_list);

    private_message_list.forEach((email, index) => {
        console.log(`Email ${index + 1}:`);
        console.log(email);
        console.log('-------------------');
    });
}

// Run the main function
main().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});