import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RedeemIcon from '@mui/icons-material/Redeem';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

const Features = () => {
	return (
		<div className='w-100' style={{ margin: '50px 0' }}>
			<div className="text-center">
				<h4 style={{ borderTop: '3px dashed black', borderBottom: '3px dashed black', padding: '5px 0' }}>VỀ CHÚNG TÔI 1</h4>
			</div>
			<section class="features-area section_gap" style={{ padding: '40px' }}>
				<div class="container">
					<div class="row features-inner">
						{/* <!-- single features --> */}
						<div class="col-lg-3 col-md-6 col-sm-6">
							<div class="single-features">
								<div class="f-icon">
									<AddLocationAltIcon style={{ fontSize: '3rem' }}></AddLocationAltIcon>
								</div>
								<h6>Hệ thống rạp toàn quốc</h6>
								<p>hơn 100 chi nhánh</p>
							</div>
						</div>
						{/* <!-- single features --> */}
						<div class="col-lg-3 col-md-6 col-sm-6">
							<div class="single-features">
								<div class="f-icon">
									<LocalMoviesIcon style={{ fontSize: '3rem' }}></LocalMoviesIcon>
								</div>
								<h6>Điện ảnh đỉnh cao</h6>
								<p>với công nghệ hiện đại</p>
							</div>
						</div>
						{/* <!-- single features --> */}
						<div class="col-lg-3 col-md-6 col-sm-6">
							<div class="single-features">
								<div class="f-icon">
									<RedeemIcon style={{ fontSize: '3rem' }}></RedeemIcon>
								</div>
								<h6>Tri ân khách hàng</h6>
								<p>với đa dạng ưu đãi</p>
							</div>
						</div>
						{/* <!-- single features --> */}
						<div class="col-lg-3 col-md-6 col-sm-6">
							<div class="single-features">
								<div class="f-icon">
									<SupportAgentIcon style={{ fontSize: '3rem' }}></SupportAgentIcon>
								</div>
								<h6>Luôn lắng nghe ý kiến</h6>
								<p>chăm sóc khách hàng 24/7</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Features
