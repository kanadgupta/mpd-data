import { useSpring, animated, config } from 'react-spring';

import PropTypes from 'prop-types';

function AnimatedNumber({ children, tag = 'span' }) {
  const Tag = animated[tag];
  const num = parseInt(children, 10);
  const { number } = useSpring({
    reset: true,
    from: { number: 0 },
    number: num,
    delay: 1000,
    // https://react-spring.io/common/configs#presets
    config: config.molasses,
  });

  return <Tag>{number.to(n => n.toFixed(0))}</Tag>;
}

AnimatedNumber.propTypes = {
  children: PropTypes.any,
  tag: PropTypes.string,
};

export default AnimatedNumber;
