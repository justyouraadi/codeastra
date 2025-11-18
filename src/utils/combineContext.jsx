// 📁 combineContext.js
import React from "react";

export default function combineContext(...providers) {
  /**
   * This combines multiple context providers together
   * and returns a single provider component
   */
  return ({ children }) => {
    return providers.reduceRight((accumulator, CurrentProvider) => {
      return <CurrentProvider>{accumulator}</CurrentProvider>;
    }, children /* Initial Value */);
  };
}

/** Example
 * combineContext(A, B, C, D) 
 * is equivalent to:
 * <A>
 *   <B>
 *     <C>
 *       <D>
 *         {children}
 *       </D>
 *     </C>
 *   </B>
 * </A>
 */

