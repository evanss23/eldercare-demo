"use client";

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    vapiSDK: {
      run: (config: {
        apiKey: string;
        assistant: string;
        config: {
          position: string;
          offset: string;
          width: string;
          height: string;
        };
      }) => any;
    };
    vapiInstance: any;
  }
}

interface VapiIntegrationProps {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: any) => void;
  onTranscript?: (role: string, transcript: string) => void;
}

export const VapiIntegration: React.FC<VapiIntegrationProps> = ({
  onCallStart,
  onCallEnd,
  onError,
  onMessage,
  onTranscript
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const vapiInstanceRef = useRef<any>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const seenTranscriptsRef = useRef<Set<string>>(new Set());
  const lastTranscriptRef = useRef<{role: string, text: string} | null>(null);

  // Replace with your actual Vapi credentials
  const assistantId = "34b00d2c-82bf-4082-908e-3649c4864001";
  const publicApiKey = "9f004905-acdd-4989-bd58-bdd71fb21c44";

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') return;

    // Load Vapi SDK script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    script.onload = () => {
      try {
        // Initialize Vapi instance with hidden widget
        if (window.vapiSDK && typeof window.vapiSDK.run === 'function') {
          vapiInstanceRef.current = window.vapiSDK.run({
            apiKey: publicApiKey,
            assistant: assistantId,
            config: {
              position: "bottom-right",
              offset: "0px",
              width: "1px",
              height: "1px"
            }
          });

          // Wait a bit for the button to be created
          setTimeout(() => {
            console.log("Vapi SDK initialized, checking for buttons...");
            const buttons = document.querySelectorAll('[id*="vapi"], [class*="vapi"]');
            console.log(`Found ${buttons.length} Vapi elements:`, Array.from(buttons).map(el => ({ id: el.id, class: el.className, tagName: el.tagName })));
          }, 1000);
        } else {
          console.warn('Vapi SDK not properly loaded');
          throw new Error('Vapi SDK not properly loaded');
        }

        window.vapiInstance = vapiInstanceRef.current;
        setIsLoaded(true);

        // Hide the default Vapi button completely but keep it functional
        const hideDefaultButton = () => {
          // Only hide specific known button IDs, don't remove from DOM
          const specificSelectors = [
            '#vapi-btn',
            '#vapi-support-btn'
          ];

          specificSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
              if (element && element instanceof HTMLElement) {
                // Hide visually but keep in DOM for functionality
                element.style.position = 'fixed';
                element.style.top = '-9999px';
                element.style.left = '-9999px';
                element.style.width = '1px';
                element.style.height = '1px';
                element.style.opacity = '0';
                element.style.pointerEvents = 'auto'; // Keep clickable
                element.style.zIndex = '-1';
                // Don't interfere with Vapi's own class management
                console.log(`Hidden Vapi button: ${selector} (classes: ${element.className})`);
              }
            });
          });

          // Add minimal CSS to hide only specific buttons without interfering with functionality
          try {
            if (!document.getElementById('vapi-hide-style') && document.head) {
              const style = document.createElement('style');
              style.textContent = `
                #vapi-btn, #vapi-support-btn {
                  position: fixed !important;
                  top: -9999px !important;
                  left: -9999px !important;
                  width: 1px !important;
                  height: 1px !important;
                  opacity: 0 !important;
                  z-index: -1 !important;
                  pointer-events: auto !important;
                }
              `;
              style.id = 'vapi-hide-style';
              document.head.appendChild(style);
            }
          } catch (cssError) {
            console.warn('Could not inject Vapi hiding CSS:', cssError);
          }
        };

        // Try to hide immediately and with delays
        hideDefaultButton();
        setTimeout(hideDefaultButton, 50);
        setTimeout(hideDefaultButton, 100);
        setTimeout(hideDefaultButton, 250);
        setTimeout(hideDefaultButton, 500);
        setTimeout(hideDefaultButton, 1000);
        setTimeout(hideDefaultButton, 2000);

        // Set up mutation observer to keep button hidden
        try {
          const observer = new MutationObserver((mutations) => {
            let shouldHide = false;
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                  if (node instanceof HTMLElement &&
                      (node.id?.includes('vapi') || node.className?.includes('vapi'))) {
                    shouldHide = true;
                  }
                });
              }
            });
            if (shouldHide) {
              hideDefaultButton();
            }
          });

          if (document.body) {
            observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id', 'class', 'style']
            });
          }
        } catch (observerError) {
          console.warn('Could not set up MutationObserver:', observerError);
        }

        // Listen for call events and set up transcript monitoring
        if (vapiInstanceRef.current) {
          // Monitor for call state changes
          checkIntervalRef.current = setInterval(() => {
            const vapiWidget = document.querySelector('.vapi-widget-active');
            const isActive = !!vapiWidget;

            if (isActive !== isCallActive) {
              setIsCallActive(isActive);
              if (isActive) {
                onCallStart?.();
              } else {
                onCallEnd?.();
              }
            }

            // Monitor for transcript updates in the Vapi widget
            if (isActive) {
              const transcriptElements = document.querySelectorAll('.vapi-transcript-item, .transcript-item, [data-role]');
              transcriptElements.forEach((element) => {
                const role = element.getAttribute('data-role') ||
                            (element.textContent?.includes('You:') ? 'user' : 'assistant');
                const text = element.textContent?.replace(/^(You:|Assistant:)/, '').trim();

                if (text && onTranscript) {
                  // Create unique key for deduplication
                  const transcriptKey = `${role}:${text}`;

                  // Only process if we haven't seen this exact transcript before
                  if (!seenTranscriptsRef.current.has(transcriptKey)) {
                    // For streaming, only update if text is significantly different or final
                    if (lastTranscriptRef.current?.role === role) {
                      // If same speaker, only update if text is much longer (not just streaming)
                      if (text.length > ((lastTranscriptRef.current?.text?.length || 0) + 10)) {
                        seenTranscriptsRef.current.add(transcriptKey);
                        lastTranscriptRef.current = { role, text };
                        onTranscript(role, text);
                      }
                    } else {
                      // Different speaker, always add
                      seenTranscriptsRef.current.add(transcriptKey);
                      lastTranscriptRef.current = { role, text };
                      onTranscript(role, text);
                    }
                  }
                }
              });
            }
          }, 500);

          // Try to listen to Vapi events if accessible
          try {
            if (vapiInstanceRef.current.on) {
              vapiInstanceRef.current.on('message', (message: any) => {
                onMessage?.(message);
                if (message.type === 'transcript' && onTranscript) {
                  const role = message.role;
                  const text = message.transcript;
                  const transcriptKey = `${role}:${text}`;

                  // Deduplicate transcript messages
                  if (!seenTranscriptsRef.current.has(transcriptKey)) {
                    // For streaming transcripts, only send final or significantly different versions
                    if (lastTranscriptRef.current?.role === role) {
                      // Same speaker - only send if text is much longer (indicating completion or significant addition)
                      if (text.length > ((lastTranscriptRef.current?.text?.length || 0) + 15) ||
                          message.transcriptType === 'final') {
                        seenTranscriptsRef.current.add(transcriptKey);
                        lastTranscriptRef.current = { role, text };
                        onTranscript(role, text);
                      }
                    } else {
                      // Different speaker - always send
                      seenTranscriptsRef.current.add(transcriptKey);
                      lastTranscriptRef.current = { role, text };
                      onTranscript(role, text);
                    }
                  }
                }
              });
            }
          } catch (error) {
            console.log('Could not set up direct event listeners, using DOM monitoring');
          }

          // Clear transcript cache when call starts
          seenTranscriptsRef.current.clear();
          lastTranscriptRef.current = null;
        }

      } catch (error) {
        console.error("Failed to initialize Vapi SDK:", error);
        onError?.(error);
      }
    };

    script.onerror = () => {
      console.error("Failed to load Vapi SDK script.");
      onError?.(new Error("Failed to load Vapi SDK"));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Public method to trigger Vapi call
  const triggerVapiCall = () => {
    if (typeof window === 'undefined') {
      console.warn("Not in browser environment");
      return;
    }

    if (!isLoaded) {
      console.warn("Vapi SDK not yet loaded");
      return;
    }

    try {
      // Try multiple strategies to find and trigger Vapi
      let triggered = false;

      // Strategy 1: Look for various button selectors
      const buttonSelectors = [
        '#vapi-btn',
        '#vapi-support-btn',
        '.vapi-btn',
        '.vapi-support-btn',
        '[data-vapi-button]',
        '[class*="vapi"]',
        '[id*="vapi"]'
      ];

      for (const selector of buttonSelectors) {
        const btn = document.querySelector(selector) as HTMLElement;
        if (btn && typeof btn.click === 'function') {
          console.log(`Found Vapi button with selector: ${selector}`);
          btn.click();
          triggered = true;
          break;
        }
      }

      // Strategy 2: Try direct Vapi instance call
      if (!triggered && vapiInstanceRef.current) {
        try {
          if (typeof vapiInstanceRef.current.start === 'function') {
            console.log("Using direct Vapi instance start");
            vapiInstanceRef.current.start();
            triggered = true;
          }
        } catch (directError) {
          console.warn("Direct Vapi instance call failed:", directError);
        }
      }

      // Strategy 3: Try window.vapiInstance
      if (!triggered && (window as any).vapiInstance) {
        try {
          if (typeof (window as any).vapiInstance.start === 'function') {
            console.log("Using window.vapiInstance start");
            (window as any).vapiInstance.start();
            triggered = true;
          }
        } catch (windowError) {
          console.warn("Window vapi instance call failed:", windowError);
        }
      }

      if (triggered) {
        setIsCallActive(true);
        console.log("Vapi call triggered successfully");
      } else {
        console.warn("Could not trigger Vapi call - no working method found");
        console.warn("Available elements:", {
          vapiButtons: document.querySelectorAll('[id*="vapi"], [class*="vapi"]').length,
          vapiInstance: !!vapiInstanceRef.current,
          windowVapi: !!(window as any).vapiInstance,
          sdkLoaded: !!window.vapiSDK,
          currentElements: Array.from(document.querySelectorAll('[id*="vapi"], [class*="vapi"]')).map(el => ({ id: el.id, class: el.className }))
        });

        // For now, just set call as active to show the UI
        // This allows fallback to regular voice recording if Vapi fails
        console.log("Proceeding anyway - user can use regular voice recording if needed");
      }
    } catch (error) {
      console.error("Error triggering Vapi call:", error);
      onError?.(error);
    }
  };

  // Public method to stop Vapi call
  const stopVapiCall = () => {
    if (typeof window === 'undefined') {
      console.warn("Not in browser environment");
      return;
    }

    console.log("Attempting to stop Vapi call...");

    try {
      let stopped = false;

      // Strategy 1: Try clicking the actual Vapi button first (most reliable for this SDK)
      const vapiButtons = document.querySelectorAll('#vapi-support-btn, #vapi-btn, .vapi-btn');
      console.log(`Found ${vapiButtons.length} Vapi buttons to try clicking`);

      for (const button of vapiButtons) {
        if (button && typeof (button as HTMLElement).click === 'function') {
          const buttonClasses = (button as HTMLElement).className;
          console.log(`Attempting to click Vapi button with classes: ${buttonClasses}`);

          // Try clicking any button that's not loading or disabled
          if (!buttonClasses.includes('loading') && !buttonClasses.includes('disabled')) {
            (button as HTMLElement).click();
            console.log("Clicked Vapi button - this should toggle the call off");

            // Wait a moment and check if the call state changed
            setTimeout(() => {
              const updatedClasses = (button as HTMLElement).className;
              console.log(`Button classes after click: ${updatedClasses}`);

              // If still showing active states, try clicking again
              if (updatedClasses.includes('active') || updatedClasses.includes('calling')) {
                console.log("Call still appears active, clicking button again");
                (button as HTMLElement).click();
              }
            }, 200);

            stopped = true;
            break;
          }
        }
      }

      // Strategy 2: Try direct Vapi instance methods as backup
      if (!stopped && vapiInstanceRef.current) {
        try {
          // Try multiple method names that Vapi might use
          const stopMethods = ['stop', 'end', 'hangup', 'disconnect', 'terminate', 'close'];

          for (const method of stopMethods) {
            if (typeof vapiInstanceRef.current[method] === 'function') {
              console.log(`Using direct Vapi instance ${method}`);
              const result = vapiInstanceRef.current[method]();
              console.log(`Result of ${method}:`, result);
              stopped = true;
              break;
            }
          }
        } catch (directError) {
          console.warn("Direct Vapi instance stop failed:", directError);
        }
      }

      // Strategy 3: Try window.vapiInstance
      if (!stopped && (window as any).vapiInstance) {
        try {
          const stopMethods = ['stop', 'end', 'hangup', 'disconnect', 'terminate', 'close'];

          for (const method of stopMethods) {
            if (typeof (window as any).vapiInstance[method] === 'function') {
              console.log(`Using window.vapiInstance ${method}`);
              const result = (window as any).vapiInstance[method]();
              console.log(`Result of window.vapiInstance.${method}:`, result);
              stopped = true;
              break;
            }
          }
        } catch (windowError) {
          console.warn("Window vapi instance stop failed:", windowError);
        }
      }

      // Strategy 3: Try various close button selectors with more comprehensive search
      if (!stopped) {
        const closeSelectors = [
          // Specific Vapi selectors
          '.vapi-close-btn',
          '.vapi-widget-close',
          '.vapi-end-call',
          '[data-vapi-close]',

          // Generic close/end selectors
          '[aria-label="End call"]',
          '[aria-label="Close"]',
          '[aria-label="Hang up"]',
          '[aria-label="Stop call"]',

          // Button text-based selectors
          'button[title*="End"]',
          'button[title*="Close"]',
          'button[title*="Hang"]',
          'button[title*="Stop"]',

          // Widget container selectors
          '.vapi-widget .close',
          '.vapi-modal .close',
          '.vapi-container button[class*="close"]',
          '.vapi-container button[class*="end"]',

          // Generic patterns
          'button:contains("End")',
          'button:contains("Close")',
          'button:contains("Stop")'
        ];

        for (const selector of closeSelectors) {
          const closeBtn = document.querySelector(selector) as HTMLElement;
          if (closeBtn && typeof closeBtn.click === 'function') {
            console.log(`Found and clicking close button with selector: ${selector}`);
            closeBtn.click();
            stopped = true;
            break;
          }
        }
      }

      // Strategy 4: Look for any button in Vapi widgets that might be the close button
      if (!stopped) {
        const vapiWidgets = document.querySelectorAll('[class*="vapi"], [id*="vapi"]');
        for (const widget of vapiWidgets) {
          const buttons = widget.querySelectorAll('button');
          for (const button of buttons) {
            const buttonText = button.textContent?.toLowerCase() || '';
            const buttonTitle = button.title?.toLowerCase() || '';
            const buttonAriaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

            if (buttonText.includes('end') || buttonText.includes('close') || buttonText.includes('stop') ||
                buttonTitle.includes('end') || buttonTitle.includes('close') || buttonTitle.includes('stop') ||
                buttonAriaLabel.includes('end') || buttonAriaLabel.includes('close') || buttonAriaLabel.includes('stop')) {
              console.log(`Found potential close button by content: "${buttonText}" "${buttonTitle}" "${buttonAriaLabel}"`);
              (button as HTMLElement).click();
              stopped = true;
              break;
            }
          }
          if (stopped) break;
        }
      }

      // Strategy 5: Fallback - try to toggle the main button (this should end the call)
      if (!stopped) {
        console.log("Attempting to toggle main Vapi button to end call");
        const mainButton = document.querySelector('#vapi-btn, #vapi-support-btn, .vapi-btn') as HTMLElement;
        if (mainButton && typeof mainButton.click === 'function') {
          console.log("Clicking main Vapi button to toggle off");
          mainButton.click();
          stopped = true;
        }
      }

      // Always set call as inactive from our side
      setIsCallActive(false);

      if (stopped) {
        console.log("Vapi call stop attempted successfully");
      } else {
        console.warn("Could not find any method to stop Vapi call");
        console.warn("Available elements:", {
          closeButtons: document.querySelectorAll('.vapi-close-btn, .vapi-widget-close, [aria-label*="End"], [aria-label*="Close"]').length,
          vapiWidgets: document.querySelectorAll('[class*="vapi"], [id*="vapi"]').length,
          allButtons: document.querySelectorAll('[class*="vapi"] button, [id*="vapi"] button').length,
          vapiInstance: !!vapiInstanceRef.current,
          windowVapi: !!(window as any).vapiInstance,
          instanceMethods: vapiInstanceRef.current ? Object.getOwnPropertyNames(vapiInstanceRef.current).filter(prop => typeof vapiInstanceRef.current[prop] === 'function') : []
        });
      }

      // Trigger onCallEnd callback
      onCallEnd?.();

    } catch (error) {
      console.error("Error stopping Vapi call:", error);
      setIsCallActive(false); // Always set to false even if error
      onCallEnd?.(); // Still trigger callback
    }
  };

  // Expose methods globally for external access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).triggerVapiCall = triggerVapiCall;
      (window as any).stopVapiCall = stopVapiCall;
    }
  }, [isLoaded]);

  return null; // This component doesn't render anything visible
};

// Hook to use Vapi integration
export const useVapi = () => {
  const [isReady, setIsReady] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Check if Vapi is loaded
    const checkVapi = setInterval(() => {
      if ((window as any).vapiInstance && (window as any).triggerVapiCall) {
        setIsReady(true);
        clearInterval(checkVapi);
      }
    }, 100);

    // Cleanup after 5 seconds if not loaded
    setTimeout(() => clearInterval(checkVapi), 5000);

    return () => clearInterval(checkVapi);
  }, []);

  const startCall = () => {
    if ((window as any).triggerVapiCall) {
      (window as any).triggerVapiCall();
      setIsCallActive(true);
    }
  };

  const stopCall = () => {
    if ((window as any).stopVapiCall) {
      (window as any).stopVapiCall();
      setIsCallActive(false);
    }
  };

  return {
    isReady,
    isCallActive,
    startCall,
    stopCall
  };
};