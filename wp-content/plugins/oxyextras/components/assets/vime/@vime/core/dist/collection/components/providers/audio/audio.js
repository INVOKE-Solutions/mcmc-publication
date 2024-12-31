import { h, Method, Component, Prop, } from '@stencil/core';
import { ViewType } from '../../core/player/ViewType';
import { isString } from '../../../utils/unit';
import { audioRegex } from '../file/utils';
import { withProviderConnect } from '../MediaProvider';
/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Audio {
  constructor() {
    /**
     * @internal Whether an external SDK will attach itself to the media player and control it.
     */
    this.willAttach = false;
    /**
     * @inheritdoc
     */
    this.preload = 'metadata';
    if (!this.willAttach)
      withProviderConnect(this);
  }
  /**
   * @internal
   */
  async getAdapter() {
    const adapter = await this.fileProvider.getAdapter();
    adapter.canPlay = async (type) => isString(type) && audioRegex.test(type);
    return adapter;
  }
  render() {
    return (
    // @ts-ignore
    h("vime-file", { noConnect: true, willAttach: this.willAttach, crossOrigin: this.crossOrigin, preload: this.preload, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, viewType: ViewType.Audio, ref: (el) => { this.fileProvider = el; } },
      h("slot", null)));
  }
  static get is() { return "vime-audio"; }
  static get properties() { return {
    "willAttach": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": "Whether an external SDK will attach itself to the media player and control it.",
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "will-attach",
      "reflect": false,
      "defaultValue": "false"
    },
    "crossOrigin": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "MediaCrossOriginOption",
        "resolved": "\"\" | \"anonymous\" | \"use-credentials\" | undefined",
        "references": {
          "MediaCrossOriginOption": {
            "location": "import",
            "path": "../file/MediaFileProvider"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "Whether to use CORS to fetch the related image. See\n[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more\ninformation."
      },
      "attribute": "cross-origin",
      "reflect": false
    },
    "preload": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "MediaPreloadOption",
        "resolved": "\"\" | \"auto\" | \"metadata\" | \"none\" | undefined",
        "references": {
          "MediaPreloadOption": {
            "location": "import",
            "path": "../file/MediaFileProvider"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "Provides a hint to the browser about what the author thinks will lead to the best user\nexperience with regards to what content is loaded before the video is played. See\n[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more\ninformation."
      },
      "attribute": "preload",
      "reflect": false,
      "defaultValue": "'metadata'"
    },
    "disableRemotePlayback": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "**EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are\nattached using wired (HDMI, DVI, etc.) and wireless technologies\n(Miracast, Chromecast, DLNA, AirPlay, etc)."
      },
      "attribute": "disable-remote-playback",
      "reflect": false
    },
    "mediaTitle": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The title of the current media."
      },
      "attribute": "media-title",
      "reflect": false
    }
  }; }
  static get methods() { return {
    "getAdapter": {
      "complexType": {
        "signature": "() => Promise<{ getInternalPlayer: () => Promise<HTMLMediaElement>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; canPlay: (type: any) => Promise<boolean>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<any>; exitFullscreen: () => Promise<any>; }>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "HTMLMediaElement": {
            "location": "global"
          }
        },
        "return": "Promise<{ getInternalPlayer: () => Promise<HTMLMediaElement>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; canPlay: (type: any) => Promise<boolean>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<any>; exitFullscreen: () => Promise<any>; }>"
      },
      "docs": {
        "text": "",
        "tags": [{
            "name": "internal",
            "text": undefined
          }]
      }
    }
  }; }
}
