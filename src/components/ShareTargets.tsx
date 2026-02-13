import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    FacebookShareCount,
    GabIcon,
    GabShareButton, HatenaIcon,
    HatenaShareButton,
    HatenaShareCount,
    InstapaperIcon,
    InstapaperShareButton,
    LineIcon,
    LineShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    MailruIcon,
    MailruShareButton,
    OKIcon,
    OKShareButton,
    OKShareCount,
    PinterestIcon,
    PinterestShareButton,
    PinterestShareCount,
    PocketIcon,
    PocketShareButton,
    RedditIcon,
    RedditShareButton,
    RedditShareCount,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TumblrShareCount,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    VKIcon,
    VKShareButton,
    VKShareCount,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    WorkplaceIcon,
    WorkplaceShareButton,
    XIcon
} from "react-share";
import * as React from "react";
import { Box, Share2 } from "lucide-react";
import { useState } from "react";


export default function ShareTargets({ shareUrl, shareContent }) {

    // const shareUrl = 'https://alllivesmatter.world';
    // const shareUrl = data.share_url;
    // const title = data.share_title;
    // const title = data.share_advocacy;
    const exampleImage = "/alm.png"
    // <img src="" alt="ALM" width={64} height={64} />
    const iconSize = 42;



    return (
        <>
            <div className="share__container bg-slate-600 text-black px-2 py-3 rounded-xl">
                <div className="share__some-network">
                    <TwitterShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <XIcon size={iconSize} round />
                    </TwitterShareButton>
                </div>

                <div className="share__some-network">
                    <FacebookShareButton url={shareUrl} className="share__some-network__share-button">
                        <FacebookIcon size={iconSize} round />
                    </FacebookShareButton>
                </div>

                <div className="share__some-network">
                    <FacebookMessengerShareButton
                        url={shareUrl}
                        appId="521270401588372"
                        className="share__some-network__share-button"
                    >
                        <FacebookMessengerIcon size={iconSize} round />
                    </FacebookMessengerShareButton>
                </div>



                <div className="share__some-network">
                    <TelegramShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <TelegramIcon size={iconSize} round />
                    </TelegramShareButton>
                </div>

                <div className="share__some-network">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={shareContent}
                        separator=":: "
                        className="share__some-network__share-button"
                    >
                        <WhatsappIcon size={iconSize} round />
                    </WhatsappShareButton>
                </div>

                <div className="share__some-network">
                    <LinkedinShareButton url={shareUrl} className="share__some-network__share-button">
                        <LinkedinIcon size={iconSize} round />
                    </LinkedinShareButton>
                </div>

                <div className="share__some-network">
                    <PinterestShareButton
                        url={String(window.location)}

                        media={`${String(window.location)}/${exampleImage}`}
                        className="share__some-network__share-button"
                    >
                        <PinterestIcon size={iconSize} round />
                    </PinterestShareButton>

                </div>

                <div className="share__some-network">
                    <VKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${exampleImage}`}
                        className="share__some-network__share-button"
                    >
                        <VKIcon size={iconSize} round />
                    </VKShareButton>

                </div>

                <div className="share__some-network">
                    <OKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${exampleImage}`}
                        className="share__some-network__share-button"
                    >
                        <OKIcon size={iconSize} round />
                    </OKShareButton>
                </div>

                <div className="share__some-network">
                    <RedditShareButton
                        url={shareUrl}
                        title={shareContent}
                        windowWidth={660}
                        windowHeight={460}
                        className="share__some-network__share-button"
                    >
                        <RedditIcon size={iconSize} round />
                    </RedditShareButton>
                </div>

                <div className="share__some-network">
                    <GabShareButton
                        url={shareUrl}
                        title={shareContent}
                        windowWidth={660}
                        windowHeight={640}
                        className="share__some-network__share-button"
                    >
                        <GabIcon size={iconSize} round />
                    </GabShareButton>
                </div>

                <div className="share__some-network">
                    <TumblrShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <TumblrIcon size={iconSize} round />
                    </TumblrShareButton>
                </div>

                <div className="share__some-network">
                    <LivejournalShareButton
                        url={shareUrl}
                        title={shareContent}
                        description={shareUrl}
                        className="share__some-network__share-button"
                    >
                        <LivejournalIcon size={iconSize} round />
                    </LivejournalShareButton>
                </div>

                <div className="share__some-network">
                    <MailruShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <MailruIcon size={iconSize} round />
                    </MailruShareButton>
                </div>

                <div className="share__some-network">
                    <EmailShareButton
                        url={shareUrl}
                        subject={shareContent}
                        body="body"
                        className="share__some-network__share-button"
                    >
                        <EmailIcon size={iconSize} round />
                    </EmailShareButton>
                </div>

                <div className="share__some-network">
                    <ViberShareButton url={shareUrl} title={shareContent} className="share__some-network__share-button">
                        <ViberIcon size={iconSize} round />
                    </ViberShareButton>
                </div>

                <div className="share__some-network">
                    <WorkplaceShareButton
                        url={shareUrl}
                        quote={shareContent}
                        className="share__some-network__share-button"
                    >
                        <WorkplaceIcon size={iconSize} round />
                    </WorkplaceShareButton>
                </div>

                <div className="share__some-network">
                    <LineShareButton url={shareUrl} title={shareContent} className="share__some-network__share-button">
                        <LineIcon size={iconSize} round />
                    </LineShareButton>
                </div>

                <div className="share__some-network">
                    <WeiboShareButton
                        url={shareUrl}
                        title={shareContent}
                        image={`${String(window.location)}/${exampleImage}`}
                        className="share__some-network__share-button"
                    >
                        <WeiboIcon size={iconSize} round />
                    </WeiboShareButton>
                </div>

                <div className="share__some-network">
                    <PocketShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <PocketIcon size={iconSize} round />
                    </PocketShareButton>
                </div>

                <div className="share__some-network">
                    <InstapaperShareButton
                        url={shareUrl}
                        title={shareContent}
                        className="share__some-network__share-button"
                    >
                        <InstapaperIcon size={iconSize} round />
                    </InstapaperShareButton>
                </div>

                <div className="share__some-network">
                    <HatenaShareButton
                        url={shareUrl}
                        title={shareContent}
                        windowWidth={660}
                        windowHeight={460}
                        className="share__some-network__share-button"
                    >
                        <HatenaIcon size={iconSize} round />
                    </HatenaShareButton>
                </div>
            </div>
        </>
    )
}
